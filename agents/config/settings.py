"""
Agent Configuration Settings
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Service key for admin writes

# Anthropic (for CrewAI with Claude)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# CrewAI LLM Config - Use Claude
CREWAI_LLM = "anthropic/claude-sonnet-4-20250514"

# Scraping Settings
SCRAPE_DELAY_SECONDS = 2  # Respectful delay between requests
MAX_RETRIES = 3
REQUEST_TIMEOUT = 30

# Priority Tiers (how often to scrape)
TIER_1_INTERVAL_HOURS = 24   # Daily for top programs
TIER_2_INTERVAL_HOURS = 72   # Every 3 days
TIER_3_INTERVAL_HOURS = 168  # Weekly

# User Agent for requests
USER_AGENT = "HSPortalOne/1.0 (Recruiting Research Bot; contact@hsportalone.com)"
