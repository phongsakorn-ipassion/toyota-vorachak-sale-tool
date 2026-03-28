import React from 'react'
import Avatar from '../ui/Avatar'

const medals = ['', '', '']

export default function Leaderboard({ teamMembers }) {
  if (!teamMembers || teamMembers.length === 0) return null

  const sorted = [...teamMembers].sort((a, b) => b.units - a.units)
  const maxUnits = sorted[0]?.units || 1

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-3">
      <h3 className="text-sm font-bold text-t1 mb-3">
        อันดับการขาย
      </h3>
      <div>
        {sorted.map((member, idx) => {
          const pct = Math.round((member.units / member.target) * 100)
          const barWidth = Math.round((member.units / maxUnits) * 100)
          const barColor =
            pct >= 70 ? '#1B7A3F' : pct >= 40 ? '#D97706' : '#DC2626'

          return (
            <div
              key={member.id}
              className="flex items-center gap-[10px] py-[9px] border-b border-border last:border-0"
            >
              {/* Rank badge */}
              <div className={`w-[27px] h-[27px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                idx === 0 ? 'bg-amber-100 text-amber-700' :
                idx === 1 ? 'bg-slate-100 text-slate-600' :
                idx === 2 ? 'bg-orange-50 text-orange-700' :
                'bg-gray-50 text-t3'
              }`}>
                {idx + 1}
              </div>

              {/* Name + units */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-t1 truncate">
                  {member.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {/* Progress bar */}
                  <div className="flex-1 h-[5px] bg-border rounded-[3px] overflow-hidden">
                    <div
                      className="h-full rounded-[3px] transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-t3 shrink-0">{member.units} คัน</span>
                </div>
              </div>

              {/* Percentage */}
              <div
                className="text-xs font-bold w-10 text-right shrink-0"
                style={{ color: barColor }}
              >
                {pct}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
