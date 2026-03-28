import React from 'react'
import KPICard from '../ui/KPICard'
import { formatCurrency } from '../../lib/formats'

const defaultConfig = {
  totalUnits: { color: '#2563EB', format: (v) => v },
  teamUnits: { color: '#2563EB', format: (v) => v },
  revenue: { color: '#16A34A', format: (v) => formatCurrency(v) },
  activeLeads: { color: '#EA580C', format: (v) => v },
  conversion: { color: '#7C3AED', format: (v) => v },
  wonLeads: { color: '#10B981', format: (v) => v },
  hotLeads: { color: '#DC2626', format: (v) => v },
  newLeads: { color: '#F59E0B', format: (v) => v },
}

export default function KPIGrid({ kpis, keys }) {
  if (!kpis) return null

  const displayKeys = keys || ['totalUnits', 'revenue', 'activeLeads', 'conversion']

  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {displayKeys.map((key) => {
        const kpi = kpis[key]
        const cfg = defaultConfig[key] || { color: '#6B7280', format: (v) => v }
        if (!kpi) return null
        return (
          <KPICard
            key={key}
            label={kpi.label}
            value={cfg.format(kpi.value)}
            target={kpi.target || 0}
            unit={kpi.unit}
            color={cfg.color}
          />
        )
      })}
    </div>
  )
}
