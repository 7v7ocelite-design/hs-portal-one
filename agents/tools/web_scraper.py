"""
Web scraping utilities with respectful rate limiting
"""
import requests
from bs4 import BeautifulSoup
from time import sleep
from typing import Optional, Dict, List
from ratelimit import limits, sleep_and_retry
from config.settings import USER_AGENT, SCRAPE_DELAY_SECONDS, REQUEST_TIMEOUT, MAX_RETRIES


class WebScraper:
    """Base web scraper with rate limiting and retry logic"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        })

    @sleep_and_retry
    @limits(calls=1, period=SCRAPE_DELAY_SECONDS)
    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse a webpage with rate limiting"""
        for attempt in range(MAX_RETRIES):
            try:
                response = self.session.get(url, timeout=REQUEST_TIMEOUT)
                response.raise_for_status()
                return BeautifulSoup(response.text, "html.parser")
            except requests.RequestException as e:
                print(f"Attempt {attempt + 1} failed for {url}: {e}")
                if attempt < MAX_RETRIES - 1:
                    sleep(SCRAPE_DELAY_SECONDS * (attempt + 1))
        return None


class RosterScraper(WebScraper):
    """Scraper for college football roster pages"""

    def scrape_roster(self, roster_url: str) -> List[Dict]:
        """
        Scrape roster from a college athletics page.
        Returns list of player dicts with name, position, class, etc.
        """
        soup = self.fetch_page(roster_url)
        if not soup:
            return []

        players = []

        # Common roster table patterns - adjust per site structure
        # Most athletics sites use tables or specific class names
        roster_table = soup.find("table", class_=lambda x: x and "roster" in x.lower()) or \
                       soup.find("table", {"id": lambda x: x and "roster" in x.lower()}) or \
                       soup.find("div", class_="roster-list")

        if roster_table:
            rows = roster_table.find_all("tr")[1:]  # Skip header
            for row in rows:
                cells = row.find_all(["td", "th"])
                if len(cells) >= 3:
                    player = {
                        "name": cells[0].get_text(strip=True),
                        "position": cells[1].get_text(strip=True) if len(cells) > 1 else None,
                        "class_year": cells[2].get_text(strip=True) if len(cells) > 2 else None,
                    }
                    players.append(player)

        return players


class StaffScraper(WebScraper):
    """Scraper for coaching staff pages"""

    def scrape_staff(self, staff_url: str) -> List[Dict]:
        """
        Scrape coaching staff from athletics page.
        Returns list of coach dicts with name, title, etc.
        """
        soup = self.fetch_page(staff_url)
        if not soup:
            return []

        coaches = []

        # Look for staff cards/sections
        staff_cards = soup.find_all("div", class_=lambda x: x and ("staff" in x.lower() or "coach" in x.lower()))

        for card in staff_cards:
            name_elem = card.find(["h3", "h4", "a", "span"], class_=lambda x: x and "name" in x.lower())
            title_elem = card.find(["p", "span", "div"], class_=lambda x: x and "title" in x.lower())

            if name_elem:
                coach = {
                    "name": name_elem.get_text(strip=True),
                    "title": title_elem.get_text(strip=True) if title_elem else None,
                }
                coaches.append(coach)

        return coaches


class TransferPortalScraper(WebScraper):
    """Scraper for transfer portal sources"""

    # Common transfer portal tracking sites
    SOURCES = [
        # Add actual sources when ready
        # "https://example.com/transfer-portal"
    ]

    def scrape_portal_entries(self) -> List[Dict]:
        """
        Scrape transfer portal entries from tracking sites.
        Returns list of transfer dicts.
        """
        all_entries = []

        for source_url in self.SOURCES:
            soup = self.fetch_page(source_url)
            if soup:
                # Parse based on source structure
                # This will need customization per source
                pass

        return all_entries
