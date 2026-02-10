# HS Portal One - Agents Knowledge Base (Long-Term Memory)
# ==========================================================
# This file captures permanent rules learned during the build.
# If an agent discovers a "gotcha" or rule, it writes it here.
# Future agents read this BEFORE writing any code.
# This creates "compound engineering" - mistakes never repeat.
# ==========================================================

## Project Rules (PERMANENT)

### Database
- **ALWAYS** query `tier1_coaches` view, NEVER `coaches` table
- The `coaches` table has 5,233 records with bad data (placeholders)
- The `tier1_coaches` view has 3,423 verified coaches only
- Supabase URL: `https://jilvjnqnihseykwzvpzp.supabase.co`

### Tech Stack (LOCKED)
- Next.js 14.2.x with App Router (NOT Pages Router)
- TypeScript strict mode (always)
- Tailwind CSS 3.4.x (NOT v4 - it's not stable yet)
- Supabase for auth AND database
- TanStack Query for data fetching
- Lucide React for icons
- Sonner for toasts

### Colors (MEMORIZE)
```
Background: #0a0a0f
Card: #12141a
Card Hover: #1a1d24
Border: #2a2d35
Athlete: #3b82f6 (blue)
High School: #d4af37 (gold)
Club: #9333ea (purple)
Coach Accent: #c41e3a (EA Sports red)
```

### File Patterns
- All components use `'use client'` directive if they have state or event handlers
- Custom hooks go in `/hooks/use-*.ts`
- Types go in `/types/*.ts`
- Supabase clients in `/lib/supabase/client.ts` (browser) and `server.ts`
- The `cn()` utility combines clsx + tailwind-merge

### Import Patterns
```typescript
// Always use @ alias for imports
import { Button } from '@/components/ui/button'
import { useCoaches } from '@/hooks/use-coaches'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/coach'
```

---

## Learned Rules (Added by Agents)

### Rule 1: [Template]
- **Discovered by**: Agent #_
- **Date**: YYYY-MM-DD
- **Issue**: [What went wrong]
- **Solution**: [How to avoid it]
- **Example**: [Code snippet if applicable]

---

# Add new rules below this line as you discover them:
