"""
CrewAI Agent for monitoring transfer portal
"""
from crewai import Agent, Task, Crew, LLM
from crewai_tools import tool
from tools.supabase_client import TransferPortalDB, ProgramsDB
from tools.web_scraper import TransferPortalScraper
from config.settings import CREWAI_LLM
from typing import List, Dict
from datetime import datetime


# Initialize
portal_db = TransferPortalDB()
programs_db = ProgramsDB()
portal_scraper = TransferPortalScraper()


@tool("Get Active Portal Entries")
def get_active_entries() -> List[Dict]:
    """Get all players currently in the transfer portal from our database"""
    return portal_db.get_active_entries()


@tool("Scrape Portal Sources")
def scrape_portal_sources() -> List[Dict]:
    """Scrape transfer portal tracking sites for new entries"""
    return portal_scraper.scrape_portal_entries()


@tool("Add Portal Entry")
def add_portal_entry(
    first_name: str,
    last_name: str,
    position: str,
    origin_school: str,
    entry_date: str = None
) -> str:
    """Add a new transfer portal entry to the database"""
    entry_data = {
        "first_name": first_name,
        "last_name": last_name,
        "position": position,
        "origin_school_name": origin_school,
        "entry_date": entry_date or datetime.utcnow().date().isoformat(),
        "status": "in_portal"
    }
    portal_db.insert_entry(entry_data)
    return f"Added {first_name} {last_name} to portal"


@tool("Update Portal Status")
def update_portal_status(
    entry_id: str,
    new_status: str,
    destination_school: str = None
) -> str:
    """Update a transfer portal entry's status"""
    destination_data = None
    if destination_school:
        destination_data = {
            "destination_school_name": destination_school,
            "committed_date": datetime.utcnow().date().isoformat()
        }
    portal_db.update_status(entry_id, new_status, destination_data)
    return f"Updated entry {entry_id} to status: {new_status}"


# Define the agent with Claude
transfer_agent = Agent(
    role="Transfer Portal Monitor",
    goal="Track and update transfer portal activity for college football players",
    backstory="""You are a transfer portal specialist who monitors player movement
    in college football. You track when players enter the portal, where they commit,
    and identify trends that could affect recruiting strategies.""",
    tools=[
        get_active_entries,
        scrape_portal_sources,
        add_portal_entry,
        update_portal_status
    ],
    llm=LLM(model=CREWAI_LLM),
    verbose=True
)


def create_monitor_task() -> Task:
    """Create a task for monitoring the transfer portal"""
    return Task(
        description="""
        1. Scrape transfer portal tracking sources for new entries
        2. Compare against our existing database entries
        3. Add any new portal entries found
        4. Check for status updates on existing entries (commitments, withdrawals)
        5. Update any changed statuses
        6. Report summary of changes
        """,
        agent=transfer_agent,
        expected_output="Summary of portal activity: new entries, commitments, withdrawals"
    )


def run_transfer_monitor():
    """Run the transfer portal monitoring crew"""
    task = create_monitor_task()
    crew = Crew(
        agents=[transfer_agent],
        tasks=[task],
        verbose=True
    )
    return crew.kickoff()


if __name__ == "__main__":
    result = run_transfer_monitor()
    print(result)
