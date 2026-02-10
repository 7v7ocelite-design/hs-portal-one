"""
HS Portal One - Scraping Agents Runner

Usage:
    python main.py roster --tier 1    # Scrape Tier 1 programs
    python main.py roster --tier 2    # Scrape Tier 2 programs
    python main.py transfers          # Monitor transfer portal
    python main.py all                # Run all agents
"""
import argparse
from scrapers.roster_agent import run_roster_scraper
from scrapers.transfer_agent import run_transfer_monitor


def main():
    parser = argparse.ArgumentParser(description="HS Portal One Scraping Agents")
    subparsers = parser.add_subparsers(dest="command", help="Agent to run")

    # Roster scraper
    roster_parser = subparsers.add_parser("roster", help="Scrape college rosters and staff")
    roster_parser.add_argument("--tier", type=int, default=1, choices=[1, 2, 3],
                               help="Priority tier to scrape (1=daily, 2=every 3 days, 3=weekly)")

    # Transfer monitor
    subparsers.add_parser("transfers", help="Monitor transfer portal")

    # Run all
    subparsers.add_parser("all", help="Run all agents")

    args = parser.parse_args()

    if args.command == "roster":
        print(f"🏈 Starting roster scraper for Tier {args.tier} programs...")
        result = run_roster_scraper(args.tier)
        print(result)

    elif args.command == "transfers":
        print("🔄 Starting transfer portal monitor...")
        result = run_transfer_monitor()
        print(result)

    elif args.command == "all":
        print("🏈 Running all agents...")

        print("\n--- Tier 1 Rosters ---")
        run_roster_scraper(1)

        print("\n--- Transfer Portal ---")
        run_transfer_monitor()

        print("\n✅ All agents complete!")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
