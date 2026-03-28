import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function TeamChart({ teamMembers }) {
  if (!teamMembers || teamMembers.length === 0) return null

  const sorted = [...teamMembers].sort((a, b) => b.units - a.units)
  const maxUnits = Math.max(...sorted.map((m) => m.units))

  const colors = sorted.map((m) => {
    const ratio = m.units / maxUnits
    if (ratio >= 0.7) return '#1B7A3F'
    if (ratio >= 0.4) return '#D97706'
    return '#DC2626'
  })

  const data = {
    labels: sorted.map((m) => m.name.split(' ')[0]),
    datasets: [
      {
        data: sorted.map((m) => m.units),
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        max: 80,
        grid: { color: '#f3f4f6' },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-3">
      <h3 className="text-sm font-bold text-t1 mb-3">
        ประสิทธิภาพทีมงาน
      </h3>
      <div style={{ height: 200 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
