"""
CrewAI Agent for scraping college football rosters
"""
from crewai import Agent, Task, Crew, LLM
from crewai_tools import tool
from tools.supabase_client import ProgramsDB, CoachesDB
from tools.web_scraper import RosterScraper, StaffScraper
from config.settings import CREWAI_LLM
from typing import List, Dict


# Initialize databases
programs_db = ProgramsDB()
coaches_db = CoachesDB()

# Initialize scrapers
roster_scraper = RosterScraper()
staff_scraper = StaffScraper()


@tool("Fetch Program URLs")
def fetch_program_urls(priority_tier: int = 1) -> List[Dict]:
    """Fetch programs that need scraping from the database"""
    programs = programs_db.get_programs_to_scrape(priority_tier)
    return [
        {
            "id": p["id"],
            "name": p["name"],
            "roster_url": p["roster_url"],
            "staff_url": p["staff_url"]
        }
        for p in programs if p.get("roster_url")
    ]


@tool("Scrape Roster Page")
def scrape_roster_page(roster_url: str) -> List[Dict]:
    """Scrape roster data from a college athletics page"""
    return roster_scraper.scrape_roster(roster_url)


@tool("Scrape Staff Page")
def scrape_staff_page(staff_url: str) -> List[Dict]:
    """Scrape coaching staff from athletics page"""
    return staff_scraper.scrape_staff(staff_url)


@tool("Save Coaches to Database")
def save_coaches(program_id: str, coaches: List[Dict]) -> str:
    """Save scraped coach data to database"""
    saved = 0
    for coach in coaches:
        name_parts = coach.get("name", "").split(" ", 1)
        coach_data = {
            "program_id": program_id,
            "first_name": name_parts[0] if name_parts else "",
            "last_name": name_parts[1] if len(name_parts) > 1 else "",
            "title": coach.get("title"),
            "is_active": True
        }
        coaches_db.upsert_coach(coach_data)
        saved += 1
    return f"Saved {saved} coaches for program {program_id}"


@tool("Mark Program Verified")
def mark_program_verified(program_id: str) -> str:
    """Update program's last_verified_at timestamp"""
    programs_db.update_verification(program_id, "scraper")
    return f"Program {program_id} marked as verified"


# Define the agent with Claude
roster_agent = Agent(
    role="College Football Data Collector",
    goal="Scrape and update college football roster and coaching staff data",
    backstory="""You are a meticulous data collector specializing in college football
    recruiting intelligence. Your job is to gather accurate roster and coaching staff
    information from official athletics websites, ensuring the database stays current
    for recruiting purposes.""",
    tools=[
        fetch_program_urls,
        scrape_roster_page,
        scrape_staff_page,
        save_coaches,
        mark_program_verified
    ],
    llm=LLM(model=CREWAI_LLM),
    verbose=True
)


def create_scrape_task(priority_tier: int = 1) -> Task:
    """Create a task for scraping programs of a given priority tier"""
    return Task(
        description=f"""
        1. Fetch all Tier {priority_tier} programs that need scraping
        2. For each program:
           a. Scrape the coaching staff page
           b. Save the coaches to the database
           c. Mark the program as verified
        3. Report how many programs and coaches were processed
        """,
        agent=roster_agent,
        expected_output="Summary of programs scraped and coaches saved"
    )


def run_roster_scraper(priority_tier: int = 1):
    """Run the roster scraping crew for a given priority tier"""
    task = create_scrape_task(priority_tier)
    crew = Crew(
        agents=[roster_agent],
        tasks=[task],
        verbose=True
    )
    return crew.kickoff()


if __name__ == "__main__":
    # Run for Tier 1 (top priority) programs
    result = run_roster_scraper(priority_tier=1)
    print(result)
