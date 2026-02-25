import Link from 'next/link'
import {
  Search,
  Shield,
  Target,
  Users,
  Zap,
  ChevronRight,
  ArrowRight,
  Database,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  Lock,
} from 'lucide-react'

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}) {
  const delayClass = [
    '',
    'animate-fade-in-delay-1',
    'animate-fade-in-delay-2',
    'animate-fade-in-delay-3',
    'animate-fade-in-delay-4',
    'animate-fade-in-delay-5',
  ][delay] || ''

  return (
    <div className={`glass-card p-6 ${delayClass}`}>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function RoleCard({
  role,
  color,
  icon,
  title,
  features,
}: {
  role: string
  color: string
  icon: React.ReactNode
  title: string
  features: string[]
}) {
  return (
    <div className="glass-card p-6 group relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
            {role}
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ===== HERO ===== */}
      <section className="hero-gradient noise-overlay relative min-h-[90vh] flex items-center">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="text-sm text-gray-300">3,423 Verified College Coaches</span>
            </div>

            {/* Main headline */}
            <h1 className="animate-fade-in-delay-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-white">Your Direct Line to</span>
              <br />
              <span className="gradient-text-gold">College Football</span>
            </h1>

            {/* Sub text */}
            <p className="animate-fade-in-delay-2 text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              The recruiting platform that connects athletes, high school programs, and clubs
              with verified college coaching staffs across every division.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#c41e3a] hover:bg-[#a3162e] text-white font-semibold transition-all duration-200 glow-red"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/coaches"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                Browse Coaches
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-delay-4 mt-12 flex items-center justify-center gap-8 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Verified Data</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated Daily</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure Platform</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ===== STATS ===== */}
      <section className="relative -mt-16 z-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="3,423" label="College Coaches" icon={<Users className="w-5 h-5 text-[#c41e3a]" />} />
          <StatCard value="6" label="Division Levels" icon={<Database className="w-5 h-5 text-[#d4af37]" />} />
          <StatCard value="50" label="States Covered" icon={<MapPin className="w-5 h-5 text-[#3b82f6]" />} />
          <StatCard value="20+" label="Conferences" icon={<TrendingUp className="w-5 h-5 text-[#9333ea]" />} />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Get Recruited
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            A complete system that gives you the edge in the recruiting process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Search className="w-5 h-5 text-[#c41e3a]" />}
            title="Coach Directory"
            description="Search 3,423 verified college coaches by name, school, division, conference, or state. Every contact verified."
            color="#c41e3a"
            delay={1}
          />
          <FeatureCard
            icon={<Target className="w-5 h-5 text-[#d4af37]" />}
            title="Fit Finder"
            description="Enter your stats and instantly see which division levels match your height, weight, speed, and GPA."
            color="#d4af37"
            delay={2}
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 text-[#3b82f6]" />}
            title="Depth Charts"
            description="Live depth charts for top programs. See who&apos;s starting, who&apos;s graduating, and where the roster gaps are."
            color="#3b82f6"
            delay={3}
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-[#9333ea]" />}
            title="Robot Scouts"
            description="AI-powered monitoring that tracks coaching staff changes, transfers, and roster updates in real-time."
            color="#9333ea"
            delay={4}
          />
          <FeatureCard
            icon={<MapPin className="w-5 h-5 text-[#22c55e]" />}
            title="Interactive Map"
            description="Visualize every program on a map. Filter by division, conference, and distance from your location."
            color="#22c55e"
            delay={5}
          />
          <FeatureCard
            icon={<Star className="w-5 h-5 text-[#f97316]" />}
            title="NIL Education"
            description="Understand how NIL works at every level. Know your worth and navigate the landscape with confidence."
            color="#f97316"
            delay={5}
          />
        </div>
      </section>

      {/* ===== WHO IT'S FOR ===== */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for Every Side of Recruiting
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Whether you&apos;re a player, a high school coach, or running a club — we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            role="Athlete"
            color="#3b82f6"
            icon={<Shield className="w-5 h-5 text-[#3b82f6]" />}
            title="Individual Athletes"
            features={[
              'Search every college coaching staff',
              'See where your stats fit by division',
              'Track depth charts and roster openings',
              'Build your recruiting profile',
            ]}
          />
          <RoleCard
            role="High School"
            color="#d4af37"
            icon={<Star className="w-5 h-5 text-[#d4af37]" />}
            title="HS Programs"
            features={[
              'Give your players a real recruiting system',
              'Show parents you invest in their future',
              'Access verified coach contacts directly',
              'Educate families on NIL and JUCO paths',
            ]}
          />
          <RoleCard
            role="Club"
            color="#9333ea"
            icon={<Users className="w-5 h-5 text-[#9333ea]" />}
            title="Clubs & 7-on-7"
            features={[
              'Differentiate your program from the rest',
              'Connect your roster to college coaches',
              'Track which players are getting looks',
              'Build credibility with college commitments',
            ]}
          />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-4xl mx-auto px-4 py-24">
        <div className="relative border-gradient">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Recruiting?
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Join the platform that puts you in direct contact with verified college coaching staffs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#c41e3a] hover:bg-[#a3162e] text-white font-semibold transition-all duration-200 glow-red"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/fit-finder"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                <Target className="w-4 h-4 text-[#d4af37]" />
                Try the Fit Finder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#2a2d35] bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xl font-bold text-white">
                HS Portal <span className="text-[#d4af37]">One</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">College Football Recruiting Platform</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/coaches" className="hover:text-white transition-colors">Coaches</Link>
              <Link href="/fit-finder" className="hover:text-white transition-colors">Fit Finder</Link>
              <Link href="/map" className="hover:text-white transition-colors">Map</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#1a1d24] text-center text-xs text-gray-600">
            &copy; 2026 HS Portal One. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
