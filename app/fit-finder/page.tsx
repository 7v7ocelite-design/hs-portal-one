'use client'

import { useState, useMemo } from 'react'
import {
  Ruler,
  Weight,
  Zap,
  GraduationCap,
  Target,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Shield,
  Info,
  Search,
  Sparkles,
} from 'lucide-react'
import { POSITION_BENCHMARKS, SAMPLE_DEPTH_CHARTS, calculateFitScore, formatHeight } from '@/lib/benchmarks'
import type { SchoolDepthChart } from '@/lib/benchmarks'

const DIVISION_LABELS: Record<string, string> = {
  FBS: 'FBS (D1)',
  FCS: 'FCS (D1-AA)',
  D2: 'Division II',
  D3: 'Division III',
  NAIA: 'NAIA',
  JUCO: 'Junior College',
}

const DIVISION_COLORS: Record<string, string> = {
  FBS: '#c41e3a',
  FCS: '#d4af37',
  D2: '#3b82f6',
  D3: '#22c55e',
  NAIA: '#9333ea',
  JUCO: '#f97316',
}

function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#d4af37' : score >= 40 ? '#f97316' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize={size * 0.28} fontWeight="bold"
          className="transform rotate-90"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {score}
        </text>
      </svg>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}

function FitBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const gradient =
    score >= 80 ? 'from-green-500 to-green-400' :
    score >= 60 ? 'from-yellow-500 to-yellow-400' :
    score >= 40 ? 'from-orange-500 to-orange-400' :
    'from-red-500 to-red-400'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-300">{icon}{label}</div>
        <span className="font-mono font-semibold text-white">{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function DepthChartTable({ chart, athletePosition }: { chart: SchoolDepthChart; athletePosition: string }) {
  const [expanded, setExpanded] = useState(false)
  const positionPlayers = chart.roster.filter(p => p.position === athletePosition)
  const otherPlayers = chart.roster.filter(p => p.position !== athletePosition)
  const showPlayers = expanded ? chart.roster : positionPlayers.length > 0 ? positionPlayers : chart.roster.slice(0, 5)

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-lg">{chart.school}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-md"
              style={{ backgroundColor: DIVISION_COLORS[chart.division] + '15', color: DIVISION_COLORS[chart.division] }}
            >
              {chart.division}
            </span>
            <span className="text-xs text-gray-500">{chart.conference}</span>
          </div>
        </div>
        {positionPlayers.length > 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Your Position</div>
            <div className="text-sm font-bold text-[#d4af37]">{positionPlayers.length} on roster</div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04] text-gray-500">
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Pos</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Depth</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Player</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">#</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Year</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Height</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Weight</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs uppercase tracking-wider">Hometown</th>
            </tr>
          </thead>
          <tbody>
            {showPlayers.map((player, idx) => (
              <tr
                key={`${player.name}-${idx}`}
                className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                  player.position === athletePosition ? 'bg-[#d4af37]/[0.04]' : ''
                }`}
              >
                <td className="px-5 py-2.5">
                  <span className={`font-semibold ${player.position === athletePosition ? 'text-[#d4af37]' : 'text-gray-300'}`}>
                    {player.position}
                  </span>
                </td>
                <td className="px-5 py-2.5">
                  {player.depth === 1 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-500/10 text-green-400">Starter</span>
                  ) : player.depth === 2 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-400">Backup</span>
                  ) : (
                    <span className="text-gray-600 text-xs">3rd</span>
                  )}
                </td>
                <td className="px-5 py-2.5 text-white font-medium">{player.name}</td>
                <td className="px-5 py-2.5 text-gray-500">#{player.number}</td>
                <td className="px-5 py-2.5 text-gray-400">{player.year}</td>
                <td className="px-5 py-2.5 text-gray-300 font-mono text-xs">{player.height}</td>
                <td className="px-5 py-2.5 text-gray-300 font-mono text-xs">{player.weight}</td>
                <td className="px-5 py-2.5 text-gray-500 text-xs">{player.hometown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(otherPlayers.length > 0 || positionPlayers.length === 0) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 text-sm text-gray-500 hover:text-white hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-1.5"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Full Roster ({chart.roster.length}) <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  )
}

export default function FitFinderPage() {
  const [position, setPosition] = useState('QB')
  const [heightFeet, setHeightFeet] = useState(6)
  const [heightInches, setHeightInches] = useState(0)
  const [weight, setWeight] = useState(200)
  const [fortyTime, setFortyTime] = useState('')
  const [gpa, setGpa] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [depthChartSearch, setDepthChartSearch] = useState('')

  const totalHeightInches = heightFeet * 12 + heightInches

  const benchmark = POSITION_BENCHMARKS.find(b => b.position === position)
  const results = useMemo(() => {
    if (!benchmark) return []
    return Object.entries(benchmark.divisions).map(([division, bench]) => {
      const scores = calculateFitScore(
        { heightInches: totalHeightInches, weight, fortyTime: fortyTime ? parseFloat(fortyTime) : undefined, gpa: gpa ? parseFloat(gpa) : undefined },
        bench
      )
      return { division, bench, scores }
    }).sort((a, b) => b.scores.overall - a.scores.overall)
  }, [benchmark, totalHeightInches, weight, fortyTime, gpa])

  const filteredCharts = SAMPLE_DEPTH_CHARTS.filter(chart =>
    !depthChartSearch || chart.school.toLowerCase().includes(depthChartSearch.toLowerCase()) ||
    chart.conference.toLowerCase().includes(depthChartSearch.toLowerCase())
  )

  const selectClass = "w-full bg-[#0a0a0f] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
  const inputClass = selectClass

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="hero-gradient noise-overlay relative border-b border-white/[0.06]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c41e3a] to-[#a3162e] flex items-center justify-center shadow-lg shadow-[#c41e3a]/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fit Finder</h1>
              <p className="text-sm text-gray-400">Compare your stats against every division level</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#d4af37]" />
                Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Position</label>
                  <select value={position} onChange={(e) => { setPosition(e.target.value); setShowResults(false) }} className={selectClass}>
                    {POSITION_BENCHMARKS.map(p => (
                      <option key={p.position} value={p.position}>{p.position} — {p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Height</label>
                  <div className="flex gap-2">
                    <select value={heightFeet} onChange={(e) => { setHeightFeet(parseInt(e.target.value)); setShowResults(false) }} className={selectClass}>
                      {[5, 6, 7].map(f => <option key={f} value={f}>{f} ft</option>)}
                    </select>
                    <select value={heightInches} onChange={(e) => { setHeightInches(parseInt(e.target.value)); setShowResults(false) }} className={selectClass}>
                      {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i} in</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Weight (lbs)</label>
                  <input type="number" value={weight} onChange={(e) => { setWeight(parseInt(e.target.value) || 0); setShowResults(false) }} className={inputClass} placeholder="200" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">40-Yard Dash <span className="text-gray-600 normal-case">(optional)</span></label>
                  <input type="number" step="0.01" value={fortyTime} onChange={(e) => { setFortyTime(e.target.value); setShowResults(false) }} className={inputClass} placeholder="4.65" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">GPA <span className="text-gray-600 normal-case">(optional)</span></label>
                  <input type="number" step="0.1" value={gpa} onChange={(e) => { setGpa(e.target.value); setShowResults(false) }} className={inputClass} placeholder="3.0" />
                </div>

                <button
                  onClick={() => setShowResults(true)}
                  className="w-full bg-gradient-to-r from-[#c41e3a] to-[#a3162e] hover:from-[#d4253f] hover:to-[#c41e3a] text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#c41e3a]/20 hover:shadow-[#c41e3a]/30"
                >
                  <Sparkles className="w-4 h-4" />
                  Find My Fit
                </button>
              </div>

              {showResults && (
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: 'Height', value: formatHeight(totalHeightInches) },
                      { label: 'Weight', value: `${weight} lbs` },
                      ...(fortyTime ? [{ label: '40-Yard', value: `${fortyTime}s` }] : []),
                      ...(gpa ? [{ label: 'GPA', value: gpa }] : []),
                    ].map(stat => (
                      <div key={stat.label} className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                        <div className="text-gray-600 text-xs">{stat.label}</div>
                        <div className="text-white font-mono font-semibold">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-8">
            {!showResults ? (
              <div className="glass-card p-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
                  <Target className="w-10 h-10 text-gray-700" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Enter Your Stats</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Fill in your profile and click &quot;Find My Fit&quot; to see where you match at every division level.
                </p>
              </div>
            ) : (
              <>
                {/* Division Fit Results */}
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                    Division Fit — {benchmark?.label}
                  </h2>

                  <div className="space-y-4">
                    {results.map(({ division, bench, scores }, idx) => (
                      <div
                        key={division}
                        className="glass-card p-5"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex items-start gap-6">
                          <ScoreRing score={scores.overall} size={90} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="font-bold text-white text-lg">{DIVISION_LABELS[division]}</h3>
                              <span
                                className="text-xs font-bold px-2.5 py-1 rounded-md"
                                style={{
                                  backgroundColor: scores.overall >= 70 ? '#22c55e12' : scores.overall >= 50 ? '#d4af3712' : '#ef444412',
                                  color: scores.overall >= 70 ? '#22c55e' : scores.overall >= 50 ? '#d4af37' : '#ef4444',
                                }}
                              >
                                {scores.overall >= 80 ? 'STRONG FIT' : scores.overall >= 60 ? 'POSSIBLE FIT' : scores.overall >= 40 ? 'REACH' : 'UNLIKELY'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <FitBar label="Height" score={scores.height} icon={<Ruler className="w-3.5 h-3.5" />} />
                              <FitBar label="Weight" score={scores.weight} icon={<Weight className="w-3.5 h-3.5" />} />
                              <FitBar label="Speed" score={scores.speed} icon={<Zap className="w-3.5 h-3.5" />} />
                              <FitBar label="Academics" score={scores.academics} icon={<GraduationCap className="w-3.5 h-3.5" />} />
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                              <span>Height: {formatHeight(bench.heightMin)}–{formatHeight(bench.heightMax)}</span>
                              <span>Weight: {bench.weightMin}–{bench.weightMax}</span>
                              <span>40: {bench.fortyMin}–{bench.fortyMax}s</span>
                              <span>GPA: {bench.gpaMin}+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* JUCO callout */}
                  <div className="mt-5 glass-card p-4 flex gap-3 border-l-2 border-[#3b82f6]">
                    <Info className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-400">
                      <span className="font-semibold text-[#3b82f6]">JUCO isn&apos;t bad.</span> Many top D1 players started at junior college.
                      It&apos;s a proven pathway to develop your game, improve academics, and still land at a 4-year program.
                    </div>
                  </div>
                </div>

                {/* Depth Charts */}
                <div className="animate-fade-in-delay-2">
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#d4af37]" />
                    Live Depth Charts
                  </h2>

                  <div className="relative mb-5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      value={depthChartSearch}
                      onChange={(e) => setDepthChartSearch(e.target.value)}
                      placeholder="Search schools or conferences..."
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:border-[#d4af37]/30 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/10 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredCharts.map(chart => (
                      <DepthChartTable key={chart.school} chart={chart} athletePosition={position} />
                    ))}
                  </div>

                  {filteredCharts.length === 0 && (
                    <div className="glass-card p-10 text-center">
                      <p className="text-gray-600">No schools match your search.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
