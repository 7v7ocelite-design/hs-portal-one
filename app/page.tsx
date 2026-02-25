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
  Activity,
  Eye,
  MessageSquare,
  Bell,
  BarChart3,
  Tv,
} from 'lucide-react'

/* ─── EA-STYLE STAT CARD (top row) ─── */
function EaStatCard({
  value,
  label,
  icon,
  accentColor = '#c41e3a',
}: {
  value: string
  label: string
  icon: React.ReactNode
  accentColor?: string
}) {
  return (
    <div className="ea-stat-card p-5 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="scoreboard-num text-3xl text-white">{value}</div>
      <div className="ea-progress-bar mt-3">
        <div className="ea-progress-fill" style={{ width: '100%', background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)` }} />
      </div>
    </div>
  )
}

/* ─── FEATURE CARD (angular EA style) ─── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="ea-landing-panel p-6 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.06]">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── PRICING TIER ─── */
function TierCard({
  name,
  price,
  features,
  featured = false,
}: {
  name: string
  price: string
  features: string[]
  featured?: boolean
}) {
  return (
    <div className={`ea-tier-card p-6 text-center ${featured ? 'featured' : ''}`}>
      <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-400 mb-2">{name}</div>
      {featured && (
        <div className="ea-badge inline-block text-white mb-3">Most Popular</div>
      )}
      <div className="scoreboard-num text-3xl text-white mb-4">{price}</div>
      <ul className="space-y-2 text-left mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
            <ChevronRight className="w-3 h-3 mt-0.5 text-[#c41e3a] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full py-2.5 text-xs font-bold uppercase tracking-widest clip-angular-sm transition-all ${
          featured
            ? 'bg-[#c41e3a] text-white hover:bg-[#d4223f]'
            : 'bg-white/[0.06] text-gray-300 border border-white/[0.1] hover:border-[#c41e3a]/50'
        }`}
      >
        Select Tier
      </Link>
    </div>
  )
}

/* ─── ACTIVITY FEED ITEM ─── */
function FeedItem({ text, time, icon }: { text: string; time: string; icon: React.ReactNode }) {
  return (
    <div className="ea-activity-item py-2.5">
      <div className="flex items-start gap-2">
        <span className="text-[#c41e3a] mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
          <span className="text-[10px] text-gray-600">{time}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── RECRUITING BOARD ROW ─── */
function BoardRow({
  school,
  state,
  division,
  interest,
  status,
}: {
  school: string
  state: string
  division: string
  interest: number
  status: string
}) {
  const statusColor = status === 'Hot' ? '#c41e3a' : status === 'Warm' ? '#d4af37' : '#3b82f6'
  return (
    <div className="ea-board-row flex items-center px-4 py-3 text-xs">
      <div className="w-[28%] font-semibold text-white truncate">{school}</div>
      <div className="w-[12%] text-gray-500 text-center">{state}</div>
      <div className="w-[15%] text-gray-500 text-center">{division}</div>
      <div className="w-[25%] px-2">
        <div className="ea-progress-bar">
          <div className="ea-progress-fill" style={{ width: `${interest}%` }} />
        </div>
      </div>
      <div className="w-[10%] text-center">
        <span className="text-[10px] font-bold uppercase" style={{ color: statusColor }}>{status}</span>
      </div>
      <div className="w-[10%] text-right">
        <button className="px-2 py-1 text-[10px] font-bold uppercase text-[#c41e3a] border border-[#c41e3a]/30 hover:bg-[#c41e3a]/10 clip-angular-sm transition-colors">
          View
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#050508]">

      {/* ===== HERO - STADIUM ===== */}
      <section className="ea-hero-stadium relative flex items-center justify-center min-h-[95vh]">
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* EA Badge */}
          <div className="animate-fade-in mb-6">
            <span className="ea-badge text-white">EA Sports × College Football</span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-delay-1 text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            <span className="text-white">High School</span>
            <br />
            <span className="gradient-text-gold">Portal</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-delay-2 text-sm sm:text-base text-gray-400 max-w-lg mx-auto mb-8 tracking-wide">
            One Coach Database. Find, Filter, Connect.
          </p>

          {/* Scoreboard-style stat row */}
          <div className="animate-fade-in-delay-3 flex items-center justify-center gap-6 sm:gap-10 mb-10">
            <div className="text-center">
              <div className="scoreboard-num text-2xl sm:text-4xl text-white">3,423</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">Coaches</div>
            </div>
            <div className="w-px h-10 bg-[#c41e3a]/30" />
            <div className="text-center">
              <div className="scoreboard-num text-2xl sm:text-4xl text-white">6</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">Divisions</div>
            </div>
            <div className="w-px h-10 bg-[#c41e3a]/30" />
            <div className="text-center">
              <div className="scoreboard-num text-2xl sm:text-4xl text-white">50</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">States</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c41e3a] hover:bg-[#d4223f] text-white font-extrabold text-sm uppercase tracking-wider clip-angular transition-all glow-red"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/coaches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.04] border border-white/[0.1] text-white font-bold text-sm uppercase tracking-wider clip-angular hover:border-[#c41e3a]/40 transition-all"
            >
              <Search className="w-4 h-4" />
              Browse Coaches
            </Link>
          </div>

          {/* Trust line */}
          <div className="animate-fade-in-delay-5 mt-10 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.15em] text-gray-600">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Verified</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Updated Daily</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure</span>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050508] to-transparent" />
      </section>

      {/* ===== TICKER BAR ===== */}
      <div className="ea-ticker py-2">
        <div className="ea-ticker-content text-[10px] font-bold uppercase tracking-[0.15em] text-white/80 px-4">
          <span>3,423 Verified Coaches</span>
          <span className="text-white/40">●</span>
          <span>NCAA Division I • II • III • NAIA • JUCO • NCCAA</span>
          <span className="text-white/40">●</span>
          <span>Real-Time Roster Updates</span>
          <span className="text-white/40">●</span>
          <span>Fit Finder Algorithm</span>
          <span className="text-white/40">●</span>
          <span>Robot Scout AI Monitoring</span>
          <span className="text-white/40">●</span>
          <span>3,423 Verified Coaches</span>
          <span className="text-white/40">●</span>
          <span>NCAA Division I • II • III • NAIA • JUCO • NCCAA</span>
          <span className="text-white/40">●</span>
          <span>Real-Time Roster Updates</span>
          <span className="text-white/40">●</span>
          <span>Fit Finder Algorithm</span>
          <span className="text-white/40">●</span>
          <span>Robot Scout AI Monitoring</span>
        </div>
      </div>

      {/* ===== DASHBOARD PREVIEW ===== */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        {/* Section header */}
        <div className="ea-header-bar mb-8 flex items-center justify-between">
          <span className="text-white">Live Recruiting Board Preview</span>
          <span className="text-white/40 text-[10px] normal-case tracking-normal font-normal">
            Updated in real-time
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recruiting Board (2/3 width) */}
          <div className="lg:col-span-2 ea-landing-panel overflow-hidden">
            {/* Table header */}
            <div className="ea-table-header flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              <div className="w-[28%]">School</div>
              <div className="w-[12%] text-center">State</div>
              <div className="w-[15%] text-center">Division</div>
              <div className="w-[25%] text-center">Interest</div>
              <div className="w-[10%] text-center">Status</div>
              <div className="w-[10%]" />
            </div>
            <BoardRow school="Alabama" state="AL" division="D1 FBS" interest={92} status="Hot" />
            <BoardRow school="Ohio State" state="OH" division="D1 FBS" interest={87} status="Hot" />
            <BoardRow school="Georgia" state="GA" division="D1 FBS" interest={78} status="Warm" />
            <BoardRow school="Clemson" state="SC" division="D1 FBS" interest={71} status="Warm" />
            <BoardRow school="Texas A&M" state="TX" division="D1 FBS" interest={65} status="New" />
            <BoardRow school="Michigan" state="MI" division="D1 FBS" interest={60} status="New" />
            <div className="px-4 py-3 text-center">
              <Link href="/coaches" className="text-[10px] font-bold uppercase tracking-widest text-[#c41e3a] hover:text-white transition-colors">
                View Full Board →
              </Link>
            </div>
          </div>

          {/* Activity Feed (1/3 width) */}
          <div className="ea-landing-panel overflow-hidden">
            <div className="ea-header-bar">
              <span className="text-white flex items-center gap-2">
                <Activity className="w-3 h-3" /> Live Activity
              </span>
            </div>
            <div className="ea-scroll-feed h-[320px] p-4">
              <div className="ea-scroll-feed-inner space-y-1">
                <FeedItem icon={<Bell className="w-3 h-3" />} text="Alabama added new WR coach" time="2 min ago" />
                <FeedItem icon={<Eye className="w-3 h-3" />} text="Ohio State viewed your profile" time="5 min ago" />
                <FeedItem icon={<MessageSquare className="w-3 h-3" />} text="New message from Georgia staff" time="12 min ago" />
                <FeedItem icon={<TrendingUp className="w-3 h-3" />} text="Clemson RB depth chart updated" time="18 min ago" />
                <FeedItem icon={<Users className="w-3 h-3" />} text="Texas A&M 2 new commitments" time="25 min ago" />
                <FeedItem icon={<Star className="w-3 h-3" />} text="Your fit score: Michigan 87%" time="30 min ago" />
                <FeedItem icon={<Zap className="w-3 h-3" />} text="Robot Scout: coaching change at LSU" time="45 min ago" />
                <FeedItem icon={<BarChart3 className="w-3 h-3" />} text="Profile views up 34% this week" time="1 hr ago" />
                {/* Duplicate for infinite scroll effect */}
                <FeedItem icon={<Bell className="w-3 h-3" />} text="Alabama added new WR coach" time="2 min ago" />
                <FeedItem icon={<Eye className="w-3 h-3" />} text="Ohio State viewed your profile" time="5 min ago" />
                <FeedItem icon={<MessageSquare className="w-3 h-3" />} text="New message from Georgia staff" time="12 min ago" />
                <FeedItem icon={<TrendingUp className="w-3 h-3" />} text="Clemson RB depth chart updated" time="18 min ago" />
                <FeedItem icon={<Users className="w-3 h-3" />} text="Texas A&M 2 new commitments" time="25 min ago" />
                <FeedItem icon={<Star className="w-3 h-3" />} text="Your fit score: Michigan 87%" time="30 min ago" />
                <FeedItem icon={<Zap className="w-3 h-3" />} text="Robot Scout: coaching change at LSU" time="45 min ago" />
                <FeedItem icon={<BarChart3 className="w-3 h-3" />} text="Profile views up 34% this week" time="1 hr ago" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOTBED MAP PREVIEW ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="ea-landing-panel p-8 relative overflow-hidden light-sweep">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Map placeholder with state dots */}
            <div className="flex-1 relative">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c41e3a] mb-4">
                Hotbed States
              </div>
              {/* Simplified US map outline using CSS */}
              <div className="relative w-full aspect-[2/1] bg-white/[0.02] rounded border border-white/[0.06] overflow-hidden">
                {/* State hotspot dots */}
                <div className="absolute w-3 h-3 rounded-full bg-[#c41e3a] animate-pulse-soft" style={{ top: '60%', left: '72%' }} title="Texas">
                  <div className="absolute inset-0 rounded-full bg-[#c41e3a] animate-ping opacity-30" />
                </div>
                <div className="absolute w-3 h-3 rounded-full bg-[#c41e3a] animate-pulse-soft" style={{ top: '72%', left: '82%' }} title="Florida">
                  <div className="absolute inset-0 rounded-full bg-[#c41e3a] animate-ping opacity-30" />
                </div>
                <div className="absolute w-3 h-3 rounded-full bg-[#c41e3a] animate-pulse-soft" style={{ top: '55%', left: '80%' }} title="Georgia">
                  <div className="absolute inset-0 rounded-full bg-[#c41e3a] animate-ping opacity-30" />
                </div>
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse-soft" style={{ top: '40%', left: '78%' }} title="Ohio" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse-soft" style={{ top: '65%', left: '76%' }} title="Alabama" />
                <div className="absolute w-2 h-2 rounded-full bg-[#3b82f6]" style={{ top: '30%', left: '85%' }} title="Pennsylvania" />
                <div className="absolute w-2 h-2 rounded-full bg-[#3b82f6]" style={{ top: '55%', left: '68%' }} title="Louisiana" />
                <div className="absolute w-2 h-2 rounded-full bg-[#3b82f6]" style={{ top: '35%', left: '45%' }} title="California" />
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
                {/* "HOTBED" labels */}
                <div className="absolute text-[9px] font-bold uppercase text-[#c41e3a] tracking-wider" style={{ top: '50%', left: '70%' }}>
                  Hotbed
                </div>
                <div className="absolute text-[9px] font-bold uppercase text-[#c41e3a] tracking-wider" style={{ top: '68%', left: '80%' }}>
                  Hotbed
                </div>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="lg:w-72 space-y-4">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                Top Recruiting States
              </div>
              {[
                { state: 'Texas', count: 487, pct: 100 },
                { state: 'Florida', count: 412, pct: 85 },
                { state: 'Georgia', count: 298, pct: 61 },
                { state: 'Ohio', count: 276, pct: 57 },
                { state: 'Alabama', count: 245, pct: 50 },
              ].map((s) => (
                <div key={s.state}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white font-semibold">{s.state}</span>
                    <span className="scoreboard-num text-xs text-[#c41e3a]">{s.count}</span>
                  </div>
                  <div className="ea-progress-bar">
                    <div className="ea-progress-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
              <Link href="/map" className="block text-center text-[10px] font-bold uppercase tracking-widest text-[#c41e3a] hover:text-white transition-colors mt-4 pt-4 border-t border-white/[0.06]">
                View Interactive Map →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="ea-header-bar mb-8">
          <span className="text-white">Key Features</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<Search className="w-6 h-6 text-[#c41e3a]" />}
            title="Interactive Database"
            description="Search 3,423+ verified coaches by school, division, conference, and state."
          />
          <FeatureCard
            icon={<Tv className="w-6 h-6 text-[#d4af37]" />}
            title="Real-Time Fluff"
            description="Live tracking of coaching changes, transfers, and roster updates."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-[#3b82f6]" />}
            title="Contact Connect"
            description="Direct access to verified coach emails, phones, and Twitter handles."
          />
          <FeatureCard
            icon={<Target className="w-6 h-6 text-[#9333ea]" />}
            title="Fit Finder"
            description="Enter your stats and see which division levels match your profile."
          />
        </div>
      </section>

      {/* ===== PRICING TIERS ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="ea-header-bar mb-8">
          <span className="text-white">Select Your Tier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TierCard
            name="Basic"
            price="Free"
            features={[
              'Limited coach access',
              'Basic search filters',
              'Profile creation',
              'Division overview',
            ]}
          />
          <TierCard
            name="Premium"
            price="$99/mo"
            featured
            features={[
              'Full coach database',
              'Advanced filters',
              'Fit Finder algorithm',
              'Live depth charts',
              'Robot Scout alerts',
            ]}
          />
          <TierCard
            name="Elite"
            price="$199/mo"
            features={[
              'Everything in Premium',
              'Analytics suite',
              'Custom reports',
              'Priority support',
              'Team management',
            ]}
          />
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="ea-landing-panel p-10 text-center relative overflow-hidden light-sweep">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3">
            Ready to Get Recruited?
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Join the platform that connects you directly with verified college coaching staffs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c41e3a] hover:bg-[#d4223f] text-white font-extrabold text-sm uppercase tracking-wider clip-angular transition-all glow-red"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/fit-finder"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.04] border border-white/[0.1] text-white font-bold text-sm uppercase tracking-wider clip-angular hover:border-[#d4af37]/40 transition-all"
            >
              <Target className="w-4 h-4 text-[#d4af37]" />
              Try Fit Finder
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BROADCAST BAR ===== */}
      <div className="broadcast-bar h-1 w-full" />

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.04] bg-[#050508]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#c41e3a] clip-angular-sm flex items-center justify-center">
                <span className="text-white font-black text-sm">P1</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">
                  HS Portal <span className="text-[#d4af37]">One</span>
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em]">College Football Recruiting</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
              <Link href="/coaches" className="hover:text-white transition-colors">Coaches</Link>
              <Link href="/fit-finder" className="hover:text-white transition-colors">Fit Finder</Link>
              <Link href="/map" className="hover:text-white transition-colors">Map</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center text-[10px] text-gray-700 uppercase tracking-[0.15em]">
            &copy; 2026 HS Portal One. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
