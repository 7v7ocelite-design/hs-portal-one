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
} from 'lucide-react'
import { POSITION_BENCHMARKS, SAMPLE_DEPTH_CHARTS, calculateFitScore, formatHeight } from '@/lib/benchmarks'
import type { PositionBenchmark, SchoolDepthChart, DepthChartPlayer } from '@/lib/benchmarks'

// Division labels for display
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
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2a2d35" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.28}
          fontWeight="bold"
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
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          {icon}
          {label}
        </div>
        <span className="font-mono font-semibold text-white">{score}</span>
      </div>
      <div className="h-2 rounded-full bg-[#2a2d35] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${score}%` }} />
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
    <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#2a2d35] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">{chart.school}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: DIVISION_COLORS[chart.division] + '20', color: DIVISION_COLORS[chart.division] }}
            >
              {chart.division}
            </span>
            <span className="text-xs text-gray-500">{chart.conference}</span>
            <span className="text-xs text-gray-600">Updated {chart.lastUpdated}</span>
          </div>
        </div>
        {positionPlayers.length > 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-400">Your Position</div>
            <div className="text-sm font-semibold text-[#d4af37]">{positionPlayers.length} players</div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2d35] text-gray-400">
              <th className="text-left px-4 py-2 font-medium">Pos</th>
              <th className="text-left px-4 py-2 font-medium">Depth</th>
              <th className="text-left px-4 py-2 font-medium">Player</th>
              <th className="text-left px-4 py-2 font-medium">#</th>
              <th className="text-left px-4 py-2 font-medium">Year</th>
              <th className="text-left px-4 py-2 font-medium">Height</th>
              <th className="text-left px-4 py-2 font-medium">Weight</th>
              <th className="text-left px-4 py-2 font-medium">Hometown</th>
            </tr>
          </thead>
          <tbody>
            {showPlayers.map((player, idx) => (
              <tr
                key={`${player.name}-${idx}`}
                className={`border-b border-[#1a1d24] hover:bg-[#1a1d24] transition-colors ${
                  player.position === athletePosition ? 'bg-[#d4af37]/5' : ''
                }`}
              >
                <td className="px-4 py-2">
                  <span
                    className={`font-semibold ${player.position === athletePosition ? 'text-[#d4af37]' : 'text-gray-300'}`}
                  >
                    {player.position}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-400">
                  {player.depth === 1 ? (
                    <span className="text-green-400 font-semibold">Starter</span>
                  ) : player.depth === 2 ? (
                    <span className="text-yellow-400">Backup</span>
                  ) : (
                    <span className="text-gray-500">3rd</span>
                  )}
                </td>
                <td className="px-4 py-2 text-white font-medium">{player.name}</td>
                <td className="px-4 py-2 text-gray-400">#{player.number}</td>
                <td className="px-4 py-2 text-gray-400">{player.year}</td>
                <td className="px-4 py-2 text-gray-300 font-mono">{player.height}</td>
                <td className="px-4 py-2 text-gray-300 font-mono">{player.weight} lbs</td>
                <td className="px-4 py-2 text-gray-500">{player.hometown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(otherPlayers.length > 0 || positionPlayers.length === 0) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1d24] transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show Full Roster ({chart.roster.length} players) <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  )
}

export default function FitFinderPage() {
  // Athlete input state
  const [position, setPosition] = useState('QB')
  const [heightFeet, setHeightFeet] = useState(6)
  const [heightInches, setHeightInches] = useState(0)
  const [weight, setWeight] = useState(200)
  const [fortyTime, setFortyTime] = useState('')
  const [gpa, setGpa] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [depthChartSearch, setDepthChartSearch] = useState('')

  const totalHeightInches = heightFeet * 12 + heightInches

  // Calculate fit for all divisions
  const benchmark = POSITION_BENCHMARKS.find(b => b.position === position)
  const results = useMemo(() => {
    if (!benchmark) return []

    return Object.entries(benchmark.divisions).map(([division, bench]) => {
      const scores = calculateFitScore(
        {
          heightInches: totalHeightInches,
          weight,
          fortyTime: fortyTime ? parseFloat(fortyTime) : undefined,
          gpa: gpa ? parseFloat(gpa) : undefined,
        },
        bench
      )
      return { division, bench, scores }
    }).sort((a, b) => b.scores.overall - a.scores.overall)
  }, [benchmark, totalHeightInches, weight, fortyTime, gpa])

  // Filter depth charts
  const filteredCharts = SAMPLE_DEPTH_CHARTS.filter(chart =>
    !depthChartSearch || chart.school.toLowerCase().includes(depthChartSearch.toLowerCase()) ||
    chart.conference.toLowerCase().includes(depthChartSearch.toLowerCase())
  )

  const handleCalculate = () => {
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#2a2d35]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/10 via-[#d4af37]/5 to-[#c41e3a]/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#c41e3a] flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Fit Finder</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Enter your stats to see where you fit at every level. Compare yourself against real depth charts and find your best path.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#d4af37]" />
                Your Profile
              </h2>

              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Position</label>
                  <select
                    value={position}
                    onChange={(e) => { setPosition(e.target.value); setShowResults(false) }}
                    className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                  >
                    {POSITION_BENCHMARKS.map(p => (
                      <option key={p.position} value={p.position}>{p.position} - {p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Height</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        value={heightFeet}
                        onChange={(e) => { setHeightFeet(parseInt(e.target.value)); setShowResults(false) }}
                        className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      >
                        {[5, 6, 7].map(f => (
                          <option key={f} value={f}>{f} ft</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={heightInches}
                        onChange={(e) => { setHeightInches(parseInt(e.target.value)); setShowResults(false) }}
                        className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>{i} in</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => { setWeight(parseInt(e.target.value) || 0); setShowResults(false) }}
                    className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    placeholder="200"
                  />
                </div>

                {/* 40 Time */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">40-Yard Dash (optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={fortyTime}
                    onChange={(e) => { setFortyTime(e.target.value); setShowResults(false) }}
                    className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    placeholder="4.65"
                  />
                </div>

                {/* GPA */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">GPA (optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gpa}
                    onChange={(e) => { setGpa(e.target.value); setShowResults(false) }}
                    className="w-full bg-[#0a0a0f] border border-[#2a2d35] rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    placeholder="3.0"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-[#c41e3a] hover:bg-[#a3162e] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Find My Fit
                </button>
              </div>

              {/* Your Stats Summary */}
              {showResults && (
                <div className="mt-6 pt-6 border-t border-[#2a2d35]">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">YOUR STATS</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                      <div className="text-gray-500 text-xs">Height</div>
                      <div className="text-white font-mono font-semibold">{formatHeight(totalHeightInches)}</div>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                      <div className="text-gray-500 text-xs">Weight</div>
                      <div className="text-white font-mono font-semibold">{weight} lbs</div>
                    </div>
                    {fortyTime && (
                      <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                        <div className="text-gray-500 text-xs">40-Yard</div>
                        <div className="text-white font-mono font-semibold">{fortyTime}s</div>
                      </div>
                    )}
                    {gpa && (
                      <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                        <div className="text-gray-500 text-xs">GPA</div>
                        <div className="text-white font-mono font-semibold">{gpa}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-8">
            {!showResults ? (
              <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-12 text-center">
                <Target className="w-16 h-16 text-[#2a2d35] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Enter Your Stats</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Fill in your profile on the left and click &quot;Find My Fit&quot; to see where you match at every division level.
                </p>
              </div>
            ) : (
              <>
                {/* Division Fit Results */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                    Division Fit Analysis — {benchmark?.label}
                  </h2>

                  <div className="space-y-4">
                    {results.map(({ division, bench, scores }) => (
                      <div
                        key={division}
                        className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-5 hover:border-[#3a3d45] transition-colors"
                      >
                        <div className="flex items-start gap-6">
                          <ScoreRing score={scores.overall} size={90} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-bold text-white text-lg">{DIVISION_LABELS[division]}</h3>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: scores.overall >= 70 ? '#22c55e20' : scores.overall >= 50 ? '#d4af3720' : '#ef444420',
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

                            {/* Benchmark range info */}
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                              <span>Avg Height: {formatHeight(bench.heightMin)}–{formatHeight(bench.heightMax)}</span>
                              <span>Avg Weight: {bench.weightMin}–{bench.weightMax} lbs</span>
                              <span>Avg 40: {bench.fortyMin}–{bench.fortyMax}s</span>
                              <span>Min GPA: {bench.gpaMin}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Education callout */}
                  <div className="mt-4 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold text-[#3b82f6]">JUCO isn&apos;t bad.</span> Many top D1 players spent time at junior college first.
                      It&apos;s a proven pathway to develop your game, improve academics, and still get recruited to a 4-year program.
                    </div>
                  </div>
                </div>

                {/* Depth Charts Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#d4af37]" />
                      Live Depth Charts
                    </h2>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={depthChartSearch}
                      onChange={(e) => setDepthChartSearch(e.target.value)}
                      placeholder="Search schools or conferences..."
                      className="w-full bg-[#12141a] border border-[#2a2d35] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredCharts.map(chart => (
                      <DepthChartTable key={chart.school} chart={chart} athletePosition={position} />
                    ))}
                  </div>

                  {filteredCharts.length === 0 && (
                    <div className="bg-[#12141a] border border-[#2a2d35] rounded-xl p-8 text-center">
                      <p className="text-gray-500">No schools match your search.</p>
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
