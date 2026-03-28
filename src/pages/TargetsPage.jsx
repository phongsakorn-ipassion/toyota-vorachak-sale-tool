import React, { useState, useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/icons/Icon'
import { useDashboardStore } from '../stores/dashboardStore'
import { useLeadStore } from '../stores/leadStore'

export default function TargetsPage() {
  const {
    teamMembers,
    kpis,
    branches,
    selectedBranch,
    setSelectedBranch,
    updateTeamMemberTarget,
    updateBranchTarget,
  } = useDashboardStore()

  const { getLeadStats } = useLeadStore()
  const leadStats = getLeadStats()

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editTargets, setEditTargets] = useState({})
  const [editBranchTarget, setEditBranchTarget] = useState(kpis.totalUnits.target)

  // Branch filter: 'all' or a branch id
  const [activeBranch, setActiveBranch] = useState('all')

  // Compute days left in month
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeft = lastDay - now.getDate()

  // Use won count from lead stats as actual units
  const branchUnits = kpis.totalUnits.value
  const branchTarget = kpis.totalUnits.target
  const branchPct = branchTarget > 0 ? Math.round((branchUnits / branchTarget) * 100) : 0
  const remaining = Math.max(branchTarget - branchUnits, 0)
  const avgPerDay = daysLeft > 0 && remaining > 0 ? (remaining / daysLeft).toFixed(1) : 0
  const currentPace =
    now.getDate() > 0 ? (branchUnits / now.getDate()).toFixed(1) : 0

  // Progress bar color helper
  const getBarColor = (pct) => {
    if (pct >= 80) return '#16A34A'
    if (pct >= 50) return '#D97706'
    return '#DC2626'
  }

  // Filter team members (demo: no real branch assignment, so show all for 'all', or cycle based on index)
  const filteredMembers = useMemo(() => {
    if (activeBranch === 'all') return teamMembers
    // For demo, distribute members across branches by index
    const branchIds = branches.map((b) => b.id)
    return teamMembers.filter((_, idx) => {
      const assignedBranch = branchIds[idx % branchIds.length]
      return assignedBranch === activeBranch
    })
  }, [teamMembers, activeBranch, branches])

  // Enter edit mode
  const startEdit = () => {
    const targets = {}
    teamMembers.forEach((m) => {
      targets[m.id] = m.target
    })
    setEditTargets(targets)
    setEditBranchTarget(branchTarget)
    setIsEditing(true)
  }

  // Save edits
  const saveEdits = () => {
    Object.entries(editTargets).forEach(([id, target]) => {
      const numTarget = parseInt(target, 10) || 0
      updateTeamMemberTarget(id, numTarget)
    })
    updateBranchTarget(parseInt(editBranchTarget, 10) || 0)
    setIsEditing(false)
  }

  // Cancel edits
  const cancelEdit = () => {
    setIsEditing(false)
    setEditTargets({})
    setEditBranchTarget(branchTarget)
  }

  return (
    <div>
      <PageHeader title="เป้าหมาย" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Branch selector pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveBranch('all')}
            className={`pill-filter ${activeBranch === 'all' ? 'on' : ''}`}
          >
            ทุกสาขา
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranch(branch.id)}
              className={`pill-filter ${activeBranch === branch.id ? 'on' : ''}`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {/* Edit / Save / Cancel buttons */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold transition-colors hover:bg-primary/20"
            >
              <Icon name="edit" size={14} />
              แก้ไข
            </button>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-t2 text-xs font-bold transition-colors hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveEdits}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold transition-colors hover:bg-primary-dark"
              >
                <Icon name="check" size={14} />
                บันทึก
              </button>
            </>
          )}
        </div>

        {/* Branch Target Card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-center mb-4">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-extrabold text-t1">
                  {branchUnits}
                </span>
                <span className="text-lg text-t3">/</span>
                <input
                  type="number"
                  value={editBranchTarget}
                  onChange={(e) => setEditBranchTarget(e.target.value)}
                  className="w-20 text-2xl font-extrabold text-center border-b-2 border-primary bg-transparent outline-none text-t1"
                  min={0}
                />
                <span className="text-lg text-t3 font-normal">คัน</span>
              </div>
            ) : (
              <div className="text-3xl font-extrabold text-t1">
                {branchUnits}
                <span className="text-lg text-t3 font-normal">
                  /{branchTarget} คัน
                </span>
              </div>
            )}
            <div className="text-xs text-t2 mt-1">เป้าหมายสาขา ประจำเดือน</div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(branchPct, 100)}%`,
                backgroundColor: getBarColor(branchPct),
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-t2">
            <span>{branchPct}% สำเร็จ</span>
            <span>เหลือ {daysLeft} วัน</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-t1">{daysLeft}</div>
              <div className="text-[10px] text-t3">วันที่เหลือ</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-t1">{avgPerDay}</div>
              <div className="text-[10px] text-t3">คัน/วัน ที่ต้องทำ</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-t1">{currentPace}</div>
              <div className="text-[10px] text-t3">คัน/วัน ปัจจุบัน</div>
            </div>
          </div>
        </div>

        {/* Team Targets */}
        <h3 className="text-sm font-bold text-t1">เป้าหมายรายบุคคล</h3>
        <div className="space-y-3">
          {filteredMembers.map((member) => {
            const memberTarget = isEditing
              ? parseInt(editTargets[member.id], 10) || 0
              : member.target
            const pct = memberTarget > 0
              ? Math.round((member.units / memberTarget) * 100)
              : 0
            const barColor = getBarColor(pct)

            return (
              <div
                key={member.id}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar initial={member.init} color={member.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-t1 truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-t3">
                      {isEditing ? (
                        <span className="flex items-center gap-1">
                          {member.units}/
                          <input
                            type="number"
                            value={editTargets[member.id] ?? member.target}
                            onChange={(e) =>
                              setEditTargets((prev) => ({
                                ...prev,
                                [member.id]: e.target.value,
                              }))
                            }
                            className="w-14 text-xs font-bold text-center border-b-2 border-primary bg-transparent outline-none text-t1"
                            min={0}
                          />
                          <span>คัน</span>
                        </span>
                      ) : (
                        `${member.units}/${memberTarget} คัน`
                      )}
                    </div>
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: barColor }}
                  >
                    {pct}%
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
