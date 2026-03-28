import React from 'react'
import FilterPill from '../ui/FilterPill'
import { useDashboardStore } from '../../stores/dashboardStore'

export default function BranchSelector() {
  const { branches, selectedBranch, setSelectedBranch } = useDashboardStore()

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {branches.map((b) => (
        <FilterPill
          key={b.id}
          label={b.name}
          active={selectedBranch === b.id}
          onClick={() => setSelectedBranch(b.id)}
        />
      ))}
    </div>
  )
}
