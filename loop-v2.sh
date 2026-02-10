#!/bin/bash

# ============================================
# REAL RALPH LOOP v2 - Infinite Memory Edition
# ============================================
# Based on Geoffrey Huntley's method + Infinite Memory Loop pattern
#
# THE INFINITE MEMORY LOOP:
# Because Claude has "amnesia" after each session, we externalize memory:
#   1. context.md = The Goal (what we're building - never changes)
#   2. todo.md = The Map (task checkboxes to mark off)
#   3. progress.txt = The Diary (notes to future selves)
#
# WORKFLOW:
#   1. START - Fresh Claude (0 tokens, genius-level)
#   2. READ - context.md, todo.md, progress.txt
#   3. ACT - Execute ONE task from todo.md
#   4. WRITE - Update todo.md checkbox, add diary entry
#   5. DIE - Session terminates completely
#   6. REPEAT - Loop spawns fresh instance
#
# WHY THIS WORKS:
# - Always using "smart" Claude (first 10% of context window)
# - Memory persists in files, not in context
# - Resumable - if it crashes at task #40, resume at #41
# - Cost effective - no re-feeding 50k tokens each time
#
# ⚠️ WARNING: Run in VM/container, not your personal machine
# ============================================

set -euo pipefail

# Configuration
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
MEMORY_DIR="${PROJECT_DIR}/memory"
CONTEXT_FILE="${MEMORY_DIR}/context.md"
TODO_FILE="${MEMORY_DIR}/todo.md"
PROGRESS_FILE="${MEMORY_DIR}/progress.txt"
SPEC_FILE="${PROJECT_DIR}/SPEC.md"
MAX_ITERATIONS="${MAX_ITERATIONS:-100}"
SLEEP_SECONDS="${SLEEP_SECONDS:-3}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║       🧠 INFINITE MEMORY LOOP - Real Ralph v2                ║"
    echo "║                   High School Portal 1                        ║"
    echo "║                                                               ║"
    echo "║   memory/context.md  = The Goal                              ║"
    echo "║   memory/todo.md     = The Map                               ║"
    echo "║   memory/progress.txt = The Diary                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"

    # Check Claude CLI
    if ! command -v claude &> /dev/null; then
        echo -e "${RED}ERROR: Claude CLI not found${NC}"
        echo "Install with: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi

    # Check memory folder exists
    if [ ! -d "$MEMORY_DIR" ]; then
        echo -e "${RED}ERROR: memory/ folder not found${NC}"
        echo "Create memory/ with context.md, todo.md, and progress.txt"
        exit 1
    fi

    # Check required files
    if [ ! -f "$CONTEXT_FILE" ]; then
        echo -e "${RED}ERROR: memory/context.md not found (The Goal)${NC}"
        exit 1
    fi

    if [ ! -f "$TODO_FILE" ]; then
        echo -e "${RED}ERROR: memory/todo.md not found (The Map)${NC}"
        exit 1
    fi

    if [ ! -f "$PROGRESS_FILE" ]; then
        echo -e "${YELLOW}Creating memory/progress.txt (The Diary)...${NC}"
        echo "# Progress Log - Ralph's Diary" > "$PROGRESS_FILE"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] INITIALIZED" >> "$PROGRESS_FILE"
    fi

    if [ ! -f "$SPEC_FILE" ]; then
        echo -e "${YELLOW}WARNING: SPEC.md not found - Ralph may need to improvise${NC}"
    fi

    echo -e "${GREEN}✓ Memory files ready${NC}"
}

count_remaining_tasks() {
    grep -c '^\- \[ \]' "$TODO_FILE" 2>/dev/null || echo "0"
}

count_completed_tasks() {
    grep -c '^\- \[x\]' "$TODO_FILE" 2>/dev/null || echo "0"
}

count_blocked_tasks() {
    grep -c '^\- \[B\]' "$TODO_FILE" 2>/dev/null || echo "0"
}

run_ralph_session() {
    local iteration=$1

    # Build the prompt - emphasizes reading memory files first
    local RALPH_PROMPT=$(cat <<'PROMPT_EOF'
You are Ralph. This is a FRESH SESSION with ZERO prior context.
You have "amnesia" - your memory was wiped. But you kept a notebook!

## STEP 1: READ YOUR MEMORY FILES (DO THIS FIRST!)

You must read these files IN ORDER to remember who you are:

1. `memory/context.md` - WHY we're building this (The Goal)
2. `memory/todo.md` - WHAT needs to be done (The Map) - find first `- [ ]`
3. `memory/progress.txt` - WHAT previous Ralphs did (The Diary)
4. `SPEC.md` - HOW to build it (exact code patterns to copy)

## STEP 2: DO EXACTLY ONE TASK

After reading your memory:
1. Find the FIRST unchecked `- [ ]` task in memory/todo.md
2. Execute it completely using patterns from SPEC.md
3. Run: `npm run build` (must pass)
4. Git commit with message: `feat(scope): description`

## STEP 3: UPDATE YOUR MEMORY (CRITICAL!)

Before exiting, you MUST write to your notebook:

1. **memory/todo.md**: Change `- [ ]` to `- [x]` for completed task

2. **memory/progress.txt**: Add diary entry at the bottom:
   ```
   [TIMESTAMP] COMPLETED: [task name]
   - What I did: [explanation]
   - Files: [list of files created/modified]
   - Issues: [any problems encountered]
   - Next Ralph: [context for the next session]
   ```

If blocked, mark task as `- [B]` and explain why in progress.txt.

## STEP 4: EXIT

Stop working. The loop will spawn a fresh Ralph for the next task.

## CRITICAL RULES
- ONE task only. No batching.
- ALWAYS read memory files FIRST
- ALWAYS update memory files LAST
- NEVER modify memory/context.md (read-only)
- Query `tier1_coaches` view, NEVER `coaches` table

START: Read memory/, execute one task, update memory/, exit.
PROMPT_EOF
)

    local completed=$(count_completed_tasks)
    local remaining=$(count_remaining_tasks)
    local blocked=$(count_blocked_tasks)
    local total=$((completed + remaining + blocked))
    local percent=0
    if [ $total -gt 0 ]; then
        percent=$((completed * 100 / total))
    fi

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ITERATION $iteration | $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo -e "${BLUE}  Progress: $completed/$total ($percent%) | Remaining: $remaining | Blocked: $blocked${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Run Claude with FRESH context
    claude --print "$RALPH_PROMPT" \
           --dangerously-skip-permissions \
           --max-turns 50 \
           --allowedTools "Bash,Read,Write,Edit,Glob,Grep"

    local exit_code=$?

    if [ $exit_code -ne 0 ]; then
        echo -e "${YELLOW}Session ended with code $exit_code${NC}"
    fi

    return $exit_code
}

main() {
    print_banner
    check_prerequisites

    local iteration=0
    local start_time=$(date +%s)

    echo ""
    echo -e "${GREEN}Starting Infinite Memory Loop...${NC}"
    echo -e "${YELLOW}Memory folder: $MEMORY_DIR${NC}"
    echo -e "${YELLOW}Max iterations: $MAX_ITERATIONS${NC}"
    echo ""

    while [ $iteration -lt $MAX_ITERATIONS ]; do
        iteration=$((iteration + 1))

        # Check if all tasks complete
        local remaining=$(count_remaining_tasks)
        if [ "$remaining" -eq "0" ]; then
            local completed=$(count_completed_tasks)
            local blocked=$(count_blocked_tasks)
            echo ""
            echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║                    🎉 ALL TASKS COMPLETE! 🎉                 ║${NC}"
            echo -e "${GREEN}║                                                              ║${NC}"
            echo -e "${GREEN}║   Completed: $completed tasks                                       ║${NC}"
            if [ "$blocked" -gt 0 ]; then
            echo -e "${YELLOW}║   Blocked: $blocked tasks (check progress.txt)                     ║${NC}"
            fi
            echo -e "${GREEN}║   Memory saved: memory/progress.txt                         ║${NC}"
            echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
            break
        fi

        # Run one Ralph session
        run_ralph_session $iteration

        # Pause before next session
        echo ""
        echo -e "${CYAN}Memory persisted. Spawning fresh Ralph in ${SLEEP_SECONDS}s...${NC}"
        sleep $SLEEP_SECONDS

    done

    # Summary
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    local completed=$(count_completed_tasks)

    echo ""
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  INFINITE MEMORY LOOP COMPLETE${NC}"
    echo -e "${BOLD}  Iterations: $iteration${NC}"
    echo -e "${BOLD}  Tasks completed: $completed${NC}"
    echo -e "${BOLD}  Duration: ${minutes}m ${seconds}s${NC}"
    echo -e "${BOLD}  History: memory/progress.txt${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

main "$@"
