import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-coach-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">HS</span>
            </div>
            <span className="text-sm text-gray-400">High School Portal 1</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/coaches" className="text-sm text-gray-400 hover:text-white transition-colors">
              Coaches
            </Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HS Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
