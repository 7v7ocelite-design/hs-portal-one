'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radio,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  Zap,
  Eye,
  TrendingUp,
  UserMinus,
  UserPlus,
  ArrowRightLeft,
} from 'lucide-react'

/* ═══════════════════════════════════════
   ROBOT SCOUT INTEGRATION UI
   ═══════════════════════════════════════ */

interface ScoutAlert {
  id: string
  type: 'coaching_change' | 'transfer' | 'roster_update' | 'new_hire' | 'departure'
  school: string
  message: string
  timestamp: string
  severity: 'high' | 'medium' | 'low'
}

interface EaRobotScoutProps {
  /** Simulated alerts - in production these come from Visualping/ChangeTower */
  alerts?: ScoutAlert[]
  /** How many schools are being monitored */
  schoolsMonitored?: number
  /** Last full scan timestamp */
  lastFullScan?: string
  /** Is currently scanning */
  isScanning?: boolean
}

const SAMPLE_ALERTS: ScoutAlert[] = [
  {
    id: '1',
    type: 'coaching_change',
    school: 'Alabama',
    message: 'Offensive Coordinator position updated — new hire detected',
    timestamp: '2 min ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'departure',
    school: 'Ohio State',
    message: 'WR Coach departure confirmed — position vacant',
    timestamp: '18 min ago',
    severity: 'high',
  },
  {
    id: '3',
    type: 'transfer',
    school: 'Georgia',
    message: '3 roster changes detected — depth chart may shift',
    timestamp: '45 min ago',
    severity: 'medium',
  },
  {
    id: '4',
    type: 'new_hire',
    school: 'Texas A&M',
    message: 'New Defensive Line Coach hired from NFL',
    timestamp: '1 hr ago',
    severity: 'medium',
  },
  {
    id: '5',
    type: 'roster_update',
    school: 'Clemson',
    message: 'Spring roster published — 4 new walk-ons added',
    timestamp: '2 hr ago',
    severity: 'low',
  },
]

export function EaRobotScout({
  alerts = SAMPLE_ALERTS,
  schoolsMonitored = 347,
  lastFullScan = '5 mins ago',
  isScanning: initialScanning = false,
}: EaRobotScoutProps) {
  const [isScanning, setIsScanning] = useState(initialScanning)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [scanProgress, setScanProgress] = useState(0)

  // Simulate scanning animation
  useEffect(() => {
    if (!isScanning) {
      setScanProgress(0)
      return
    }
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false)
          return 0
        }
        return prev + 2
      })
    }, 100)
    return () => clearInterval(interval)
  }, [isScanning])

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id))
  const highAlerts = visibleAlerts.filter((a) => a.severity === 'high')

  const getAlertIcon = (type: ScoutAlert['type']) => {
    switch (type) {
      case 'coaching_change': return <ArrowRightLeft className="w-3.5 h-3.5" />
      case 'departure': return <UserMinus className="w-3.5 h-3.5" />
      case 'new_hire': return <UserPlus className="w-3.5 h-3.5" />
      case 'transfer': return <TrendingUp className="w-3.5 h-3.5" />
      case 'roster_update': return <RefreshCw className="w-3.5 h-3.5" />
    }
  }

  const getSeverityColor = (severity: ScoutAlert['severity']) => {
    switch (severity) {
      case 'high': return '#c41e3a'
      case 'medium': return '#eab308'
      case 'low': return '#3b82f6'
    }
  }

  return (
    <div className="ea-hud-card overflow-hidden">
      {/* ── Header ── */}
      <div className="ea-header-bar flex items-center justify-between">
        <span className="text-white flex items-center gap-2">
          <Radio className="w-3.5 h-3.5" />
          Robot Scout
        </span>
        <div className="flex items-center gap-2">
          {highAlerts.length > 0 && (
            <span className="ea-badge bg-white text-[#c41e3a] text-[8px] py-0 px-1.5">
              {highAlerts.length} ALERT{highAlerts.length > 1 ? 'S' : ''}
            </span>
          )}
          <span className="glow-dot-green" />
        </div>
      </div>

      {/* ── High Priority Alert Banner ── */}
      <AnimatePresence>
        {highAlerts.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="ea-alert-banner px-4 py-2.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white">
                  New Changes Detected
                </span>
                <span className="text-[9px] text-white/70 block">
                  {highAlerts.length} high-priority update{highAlerts.length > 1 ? 's' : ''} requiring attention
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status Panel ── */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="scoreboard-num text-lg text-white">{schoolsMonitored}</div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-gray-600 font-bold mt-0.5">Monitored</div>
        </div>
        <div className="text-center">
          <div className="scoreboard-num text-lg text-[#22c55e]">{visibleAlerts.length}</div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-gray-600 font-bold mt-0.5">Alerts</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-400 font-semibold">{lastFullScan}</span>
          </div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-gray-600 font-bold mt-0.5">Last Scan</div>
        </div>
      </div>

      {/* ── Scan Button + Progress ── */}
      <div className="px-4 pb-3">
        <button
          onClick={() => !isScanning && setIsScanning(true)}
          disabled={isScanning}
          className={`ea-btn-skew w-full justify-center py-2.5 text-[10px] ${
            isScanning ? 'ea-btn-skew-dark opacity-70' : 'ea-btn-skew-red'
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning... {scanProgress}%</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              <span>Run Manual Scan</span>
            </>
          )}
        </button>
        {isScanning && (
          <div className="ea-progress-bar mt-2">
            <motion.div
              className="ea-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${scanProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Alerts Feed ── */}
      <div className="border-t border-white/[0.04]">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
            Recent Activity
          </span>
          {dismissedAlerts.size > 0 && (
            <button
              onClick={() => setDismissedAlerts(new Set())}
              className="text-[9px] text-[#c41e3a] font-bold uppercase tracking-wider hover:text-white transition-colors"
            >
              Show All
            </button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto ea-scrollbar">
          <AnimatePresence>
            {visibleAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-start gap-2.5">
                  {/* Severity indicator */}
                  <div
                    className="w-7 h-7 shrink-0 rounded flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: `${getSeverityColor(alert.severity)}15`,
                      color: getSeverityColor(alert.severity),
                    }}
                  >
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white uppercase">{alert.school}</span>
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                        style={{
                          color: getSeverityColor(alert.severity),
                          backgroundColor: `${getSeverityColor(alert.severity)}15`,
                        }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{alert.message}</p>
                    <span className="text-[9px] text-gray-600 mt-1 block">{alert.timestamp}</span>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => setDismissedAlerts((prev) => new Set([...prev, alert.id]))}
                    className="opacity-0 group-hover:opacity-100 text-[9px] text-gray-600 hover:text-white transition-all shrink-0 mt-1"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleAlerts.length === 0 && (
            <div className="px-4 py-8 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                All Clear — No New Changes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2">
          <span className="glow-dot-green" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-gray-500 font-bold">
            Scout Bot Active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-gray-600" />
          <span className="text-[9px] text-gray-600 font-semibold">
            Watching {schoolsMonitored} schools
          </span>
        </div>
      </div>
    </div>
  )
}
