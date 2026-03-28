import React from 'react'
import KPICard from '../ui/KPICard'
import { formatCurrency } from '../../lib/formats'

const kpiConfig = {
  totalUnits: { color: '#2563EB', format: (v) => v },
  revenue: { color: '#16A34A', format: (v) => formatCurrency(v) },
  activeLeads: { color: '#EA580C', format: (v) => v },
  conversion: { color: '#7C3AED', format: (v) => v },
}

export default function KPIGrid({ kpis }) {
  if (!kpis) return null

  const keys = ['totalUnits', 'revenue', 'activeLeads', 'conversion']

  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {keys.map((key) => {
        const kpi = kpis[key]
        const cfg = kpiConfig[key]
        if (!kpi) return null
        return (
          <KPICard
            key={key}
            label={kpi.label}
            value={cfg.format(kpi.value)}
            target={key === 'revenue' ? 0 : kpi.target}
            unit={kpi.unit}
            color={cfg.color}
          />
        )
      })}
    </div>
  )
}
