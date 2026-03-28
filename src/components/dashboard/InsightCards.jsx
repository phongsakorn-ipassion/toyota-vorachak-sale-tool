import React from 'react'

const typeStyles = {
  alert: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  info: 'bg-primary-light text-primary border border-primary-medium',
}

export default function InsightCards({ insights }) {
  if (!insights || insights.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-t1">AI Insights</h3>
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`rounded-md text-[12px] font-semibold ${
            typeStyles[insight.type] || typeStyles.info
          }`}
          style={{ padding: '11px 13px' }}
        >
          <div className="flex items-start gap-2">
            <span className="text-base">{insight.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold">
                {insight.title}
              </div>
              <div className="opacity-80 mt-0.5">{insight.message}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
