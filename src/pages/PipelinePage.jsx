import React from 'react'
import PageHeader from '../components/layout/PageHeader'
import Avatar from '../components/ui/Avatar'
import { LEADS_LIST, CARS } from '../lib/mockData'
import { formatPrice } from '../lib/formats'

const COLUMNS = [
  { id: 'new', label: 'ใหม่', color: '#3B82F6' },
  { id: 'test', label: 'ทดสอบรถ', color: '#F59E0B' },
  { id: 'negotiate', label: 'เจรจา', color: '#8B5CF6' },
  { id: 'won', label: 'ชนะ', color: '#16A34A' },
  { id: 'lost', label: 'แพ้', color: '#DC2626' },
]

// Distribute leads across pipeline columns for demo
const pipelineData = {
  new: [LEADS_LIST[2]], // oranee
  test: [LEADS_LIST[0]], // duangjai
  negotiate: [LEADS_LIST[1]], // prawit
  won: [LEADS_LIST[3]], // jirawat
  lost: [],
}

export default function PipelinePage() {
  return (
    <div>
      <PageHeader title="Sales Pipeline" showBack />
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 1100 }}>
          {COLUMNS.map((col) => {
            const leads = pipelineData[col.id] || []
            return (
              <div
                key={col.id}
                className="min-w-[200px] flex-1 bg-gray-50 rounded-lg p-3"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="text-sm font-bold text-t1">
                      {col.label}
                    </span>
                  </div>
                  <span className="bg-white text-xs font-bold text-t2 px-2 py-0.5 rounded-full border border-border">
                    {leads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {leads.map((lead) => {
                    const car = CARS[lead.car]
                    return (
                      <div
                        key={lead.id}
                        className="bg-white rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar
                            initial={lead.init}
                            color={lead.color}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-t1 truncate">
                              {lead.name}
                            </div>
                          </div>
                        </div>
                        {car && (
                          <div className="text-xs text-t2">
                            {car.name}
                          </div>
                        )}
                        {car && (
                          <div className="text-xs font-bold text-primary mt-1">
                            {car.priceLabel}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
