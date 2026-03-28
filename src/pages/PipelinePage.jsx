import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import Icon from '../components/icons/Icon'
import { useLeadStore } from '../stores/leadStore'
import { PIPELINE_STAGES, CARS, TEAM_MEMBERS } from '../lib/mockData'
import { formatPrice, formatCurrency } from '../lib/formats'

const LEVEL_COLORS = {
  hot: '#DC2626',
  warm: '#F59E0B',
  cool: '#3B82F6',
  won: '#10B981',
  lost: '#6B7280',
}

const LEVEL_LABELS = {
  hot: 'ร้อน',
  warm: 'อุ่น',
  cool: 'เย็น',
  won: 'ชนะ',
  lost: 'แพ้',
}

export default function PipelinePage() {
  const navigate = useNavigate()
  const { getPipelineData, changeStage, leads } = useLeadStore()
  const pipeline = getPipelineData()

  const [stageModalOpen, setStageModalOpen] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  // Count leads per stage
  const stageCounts = {}
  PIPELINE_STAGES.forEach((s) => {
    stageCounts[s.id] = (pipeline[s.id] || []).length
  })

  const handleChangeStage = (leadId, newStage) => {
    changeStage(leadId, newStage)
    setStageModalOpen(false)
    setSelectedLeadId(null)
  }

  const openStageModal = (e, leadId) => {
    e.stopPropagation()
    setSelectedLeadId(leadId)
    setStageModalOpen(true)
  }

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId)
    : null

  // Get team member name by id
  const getSalesName = (assignedTo) => {
    const member = TEAM_MEMBERS.find((m) => m.id === assignedTo)
    return member ? member.name : '-'
  }

  return (
    <div>
      <PageHeader title="Sales Pipeline" showBack />

      {/* Summary pills */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border whitespace-nowrap"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-xs font-bold text-t1">{stage.label}</span>
              <span
                className="text-xs font-extrabold px-1.5 py-0.5 rounded-full text-white min-w-[20px] text-center"
                style={{ backgroundColor: stage.color }}
              >
                {stageCounts[stage.id]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="px-4 pb-24 overflow-x-auto">
        <div className="flex gap-3 snap-x snap-mandatory" style={{ minWidth: 1100 }}>
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = pipeline[stage.id] || []
            const totalValue = stageLeads.reduce((sum, lead) => {
              const car = CARS[lead.car]
              return sum + (car ? car.price : 0)
            }, 0)

            return (
              <div
                key={stage.id}
                className="min-w-[220px] flex-1 bg-gray-50 rounded-xl p-3 snap-start"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-bold text-t1">
                      {stage.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-white text-xs font-bold text-t2 px-2 py-0.5 rounded-full border border-border">
                      {stageLeads.length}
                    </span>
                    {stage.id === 'new' && (
                      <button
                        onClick={() => navigate('/acard')}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-white transition-colors"
                        style={{ backgroundColor: stage.color }}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {stageLeads.map((lead) => {
                    const car = CARS[lead.car]
                    const levelColor = LEVEL_COLORS[lead.level] || '#6B7280'
                    const levelLabel = LEVEL_LABELS[lead.level] || lead.level

                    return (
                      <div
                        key={lead.id}
                        onClick={() => navigate(`/lead/${lead.id}`)}
                        className="bg-white rounded-lg border border-border p-3 cursor-pointer hover:shadow-md transition-shadow relative"
                        style={{ borderLeft: `3px solid ${levelColor}` }}
                      >
                        {/* Lead name + avatar */}
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar
                            initial={lead.init || lead.name?.charAt(0)}
                            color={lead.color || levelColor}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-t1 truncate">
                              {lead.name}
                            </div>
                          </div>
                        </div>

                        {/* Car name */}
                        {car && (
                          <div className="text-xs text-t2 truncate">
                            {car.name}
                          </div>
                        )}

                        {/* Price */}
                        {car && (
                          <div className="text-xs font-bold text-primary mt-1">
                            {car.priceLabel}
                          </div>
                        )}

                        {/* Sales person */}
                        {lead.assignedTo && (
                          <div className="text-[10px] text-t3 mt-1.5 truncate">
                            <span className="text-t3">
                              {getSalesName(lead.assignedTo)}
                            </span>
                          </div>
                        )}

                        {/* Level badge + move stage button */}
                        <div className="flex items-center justify-between mt-2">
                          <button
                            onClick={(e) => openStageModal(e, lead.id)}
                            className={`badge-${lead.level === 'lost' ? 'cool' : lead.level || 'warm'} flex items-center gap-1`}
                            title="เปลี่ยนสถานะ"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: levelColor }}
                            />
                            {levelLabel}
                          </button>
                          <button
                            onClick={(e) => openStageModal(e, lead.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-t3 transition-colors"
                            title="ย้ายสถานะ"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14" />
                              <path d="M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total value footer */}
                {stageLeads.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200 text-center">
                    <div className="text-[10px] text-t3 uppercase tracking-wide">
                      มูลค่ารวม
                    </div>
                    <div className="text-xs font-bold text-t1">
                      {formatCurrency(totalValue)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage change modal */}
      <Modal
        isOpen={stageModalOpen}
        onClose={() => {
          setStageModalOpen(false)
          setSelectedLeadId(null)
        }}
        title="ย้ายสถานะ"
      >
        {selectedLead && (
          <div>
            <div className="text-sm text-t2 mb-4">
              ย้าย <span className="font-bold text-t1">{selectedLead.name}</span> ไปยังสถานะ:
            </div>
            <div className="space-y-2">
              {PIPELINE_STAGES.map((stage) => {
                const isCurrent = selectedLead.stage === stage.id
                return (
                  <button
                    key={stage.id}
                    onClick={() =>
                      !isCurrent && handleChangeStage(selectedLead.id, stage.id)
                    }
                    disabled={isCurrent}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary/5 cursor-default'
                        : 'border-border bg-white hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium text-t1 flex-1 text-left">
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        ปัจจุบัน
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
