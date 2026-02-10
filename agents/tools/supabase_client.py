"""
Supabase client for agent data operations
"""
from supabase import create_client, Client
from config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY
from datetime import datetime
from typing import Optional, List, Dict, Any


def get_client() -> Client:
    """Get Supabase client with service role (admin access)"""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class ProgramsDB:
    """Database operations for college programs"""

    def __init__(self):
        self.client = get_client()
        self.table = "college_programs"

    def get_programs_to_scrape(self, priority_tier: Optional[int] = None) -> List[Dict]:
        """Get programs that need scraping based on last_verified_at"""
        query = self.client.table(self.table).select("*").eq("is_active", True)

        if priority_tier:
            query = query.eq("priority_tier", priority_tier)

        return query.execute().data

    def get_by_id(self, program_id: str) -> Optional[Dict]:
        """Get a single program by ID"""
        result = self.client.table(self.table).select("*").eq("id", program_id).single().execute()
        return result.data

    def update_verification(self, program_id: str, source: str = "scraper"):
        """Mark program as verified"""
        self.client.table(self.table).update({
            "last_verified_at": datetime.utcnow().isoformat(),
            "verification_source": source
        }).eq("id", program_id).execute()


class CoachesDB:
    """Database operations for college coaches"""

    def __init__(self):
        self.client = get_client()
        self.table = "college_coaches"

    def upsert_coach(self, coach_data: Dict[str, Any]) -> Dict:
        """Insert or update a coach record"""
        coach_data["last_verified_at"] = datetime.utcnow().isoformat()
        coach_data["verification_source"] = "scraper"

        result = self.client.table(self.table).upsert(
            coach_data,
            on_conflict="program_id,first_name,last_name"
        ).execute()
        return result.data

    def get_by_program(self, program_id: str) -> List[Dict]:
        """Get all coaches for a program"""
        return self.client.table(self.table).select("*").eq("program_id", program_id).execute().data

    def mark_inactive(self, coach_id: str):
        """Mark a coach as no longer active"""
        self.client.table(self.table).update({
            "is_active": False,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", coach_id).execute()


class TransferPortalDB:
    """Database operations for transfer portal"""

    def __init__(self):
        self.client = get_client()
        self.table = "transfer_portal"

    def insert_entry(self, entry_data: Dict[str, Any]) -> Dict:
        """Add new transfer portal entry"""
        entry_data["last_verified_at"] = datetime.utcnow().isoformat()
        entry_data["verification_source"] = "scraper"

        result = self.client.table(self.table).insert(entry_data).execute()
        return result.data

    def update_status(self, entry_id: str, status: str, destination_data: Optional[Dict] = None):
        """Update transfer portal entry status"""
        update_data = {
            "status": status,
            "last_verified_at": datetime.utcnow().isoformat()
        }
        if destination_data:
            update_data.update(destination_data)

        self.client.table(self.table).update(update_data).eq("id", entry_id).execute()

    def get_active_entries(self) -> List[Dict]:
        """Get all players currently in portal"""
        return self.client.table(self.table).select("*").eq("status", "in_portal").execute().data


class StaffChangesDB:
    """Database operations for staff changes"""

    def __init__(self):
        self.client = get_client()
        self.table = "staff_changes"

    def log_change(self, change_data: Dict[str, Any]) -> Dict:
        """Log a coaching staff change"""
        result = self.client.table(self.table).insert(change_data).execute()
        return result.data
