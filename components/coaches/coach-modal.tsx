'use client'

import { useEffect, useCallback, useState } from 'react'
import { X, Mail, Twitter, Phone, Copy, ExternalLink, User, Building2, MapPin, Pencil, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import type { Coach } from '@/types/coach'

interface CoachModalProps {
  coach: Coach | null
  isOpen: boolean
  onClose: () => void
  onSchoolClick?: (schoolName: string) => void
  isAdmin?: boolean  // Only admins can edit
}

export function CoachModal({ coach, isOpen, onClose, onSchoolClick, isAdmin = false }: CoachModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Coach>>({})
  const queryClient = useQueryClient()
  const supabase = createClient()

  // Reset edit state when modal opens/closes or coach changes
  useEffect(() => {
    if (coach) {
      setEditData({
        first_name: coach.first_name,
        last_name: coach.last_name,
        position_title: coach.position_title,
        school_name: coach.school_name,
        state: coach.state,
        division_level: coach.division_level,
        conference: coach.conference,
        email: coach.email,
        twitter: coach.twitter,
        phone: coach.phone,
      })
    }
    setIsEditing(false)
  }, [coach, isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isEditing])

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`)
    })
  }, [])

  const handleSave = async () => {
    if (!coach) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('coaches')
        .update({
          first_name: editData.first_name,
          last_name: editData.last_name,
          position_title: editData.position_title,
          school_name: editData.school_name,
          state: editData.state,
          division_level: editData.division_level,
          conference: editData.conference,
          email: editData.email,
          twitter: editData.twitter,
          phone: editData.phone,
        })
        .eq('id', coach.id)

      if (error) throw error

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['coaches'] })
      await queryClient.invalidateQueries({ queryKey: ['coaches-paginated'] })

      setIsEditing(false)
      alert('Coach updated successfully!')
    } catch (error) {
      console.error('Error updating coach:', error)
      alert('Failed to update coach. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !coach) return null

  const getDivisionLabel = (division: string): string => {
    const labels: Record<string, string> = {
      'FBS': 'NCAA Division I (FBS)',
      'FCS': 'NCAA Division I (FCS)',
      'D2': 'NCAA Division II',
      'D3': 'NCAA Division III',
      'NAIA': 'NAIA',
      'JUCO': 'Junior College',
    }
    return labels[division] || division
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg ea-panel ea-glow animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="ea-panel-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-white/20 clip-angular-sm">
              <User className="w-5 h-5 text-ea-red" />
            </div>
            <span className="text-sm font-black tracking-wider">
              {isEditing ? 'EDIT COACH' : 'COACH PROFILE'}
            </span>
          </div>

          {/* Edit/Save Button - Admin Only */}
          {isAdmin && (
            !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ea-red/20 hover:bg-ea-red/40 text-ea-red text-xs font-bold uppercase tracking-wider rounded transition-colors mr-8"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors mr-8 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={editData.first_name || ''}
                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={editData.last_name || ''}
                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Position Title</label>
                <input
                  type="text"
                  value={editData.position_title || ''}
                  onChange={(e) => setEditData({ ...editData, position_title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                />
              </div>

              {/* School */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">School</label>
                <input
                  type="text"
                  value={editData.school_name || ''}
                  onChange={(e) => setEditData({ ...editData, school_name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                />
              </div>

              {/* State & Division */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    value={editData.state || ''}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                    placeholder="e.g. AL, CA, TX"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Division</label>
                  <select
                    value={editData.division_level || ''}
                    onChange={(e) => setEditData({ ...editData, division_level: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="FBS">FBS</option>
                    <option value="FCS">FCS</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="NAIA">NAIA</option>
                    <option value="JUCO">JUCO</option>
                  </select>
                </div>
              </div>

              {/* Conference */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Conference</label>
                <input
                  type="text"
                  value={editData.conference || ''}
                  onChange={(e) => setEditData({ ...editData, conference: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                />
              </div>

              {/* Divider */}
              <div className="border-t-2 border-ea-red/40 my-4" />

              {/* Contact Fields */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Twitter (without @)</label>
                <input
                  type="text"
                  value={editData.twitter || ''}
                  onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                  placeholder="CoachHandle"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-black/60 border border-gray-600 rounded text-white focus:border-ea-red focus:outline-none"
                />
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setIsEditing(false)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* View Mode */
            <>
              {/* Name & Position */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white">
                  {coach.first_name} {coach.last_name}
                </h2>
                <p className="text-ea-red font-bold uppercase tracking-wider">
                  {coach.position_title}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-ea-red/40" />

              {/* School Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-ea-red shrink-0 mt-0.5" />
                  <div>
                    <button
                      onClick={() => onSchoolClick?.(coach.school_name)}
                      className="text-white font-bold hover:text-ea-red transition-colors text-left"
                    >
                      {coach.school_name}
                    </button>
                    <p className="text-sm text-gray-400">{getDivisionLabel(coach.division_level)}</p>
                    {coach.conference && (
                      <p className="text-sm text-gray-500">{coach.conference}</p>
                    )}
                  </div>
                </div>

                {coach.state && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-ea-red shrink-0" />
                    <span className="text-gray-300">{coach.state}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-ea-red/40" />

              {/* Contact Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase">
                  Contact Information
                </h3>

                {/* Email */}
                {coach.email ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${coach.email}`}
                      className="ea-button-primary flex-1 flex items-center justify-center gap-2 text-sm py-3"
                    >
                      <Mail className="w-4 h-4" />
                      EMAIL COACH
                    </a>
                    <button
                      onClick={() => copyToClipboard(coach.email!, 'Email')}
                      className="ea-button-secondary p-3"
                      title="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-black/40 border border-gray-700 clip-angular-sm text-center text-gray-500 text-sm">
                    No email available
                  </div>
                )}

                {/* Twitter */}
                {coach.twitter ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://twitter.com/${coach.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-sm py-3 bg-[#1DA1F2] text-white font-bold uppercase tracking-wider hover:bg-[#1a8cd8] transition-colors clip-angular-sm"
                    >
                      <Twitter className="w-4 h-4" />
                      @{coach.twitter}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(`@${coach.twitter}`, 'Twitter handle')}
                      className="ea-button-secondary p-3"
                      title="Copy Twitter handle"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-black/40 border border-gray-700 clip-angular-sm text-center text-gray-500 text-sm">
                    No Twitter available
                  </div>
                )}

                {/* Phone */}
                {coach.phone ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${coach.phone}`}
                      className="ea-button-secondary flex-1 flex items-center justify-center gap-2 text-sm py-3"
                    >
                      <Phone className="w-4 h-4" />
                      {coach.phone}
                    </a>
                    <button
                      onClick={() => copyToClipboard(coach.phone!, 'Phone number')}
                      className="ea-button-secondary p-3"
                      title="Copy phone number"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-black/40 border border-gray-700 clip-angular-sm text-center text-gray-500 text-sm">
                    No phone available
                  </div>
                )}
              </div>

              {/* View Full Staff Button */}
              <button
                onClick={() => {
                  onClose()
                  onSchoolClick?.(coach.school_name)
                }}
                className="ea-button-gold w-full flex items-center justify-center gap-2"
              >
                VIEW FULL STAFF AT {coach.school_name.toUpperCase().slice(0, 25)}
                {coach.school_name.length > 25 && '...'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
