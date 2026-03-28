import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
)

export default function WeeklyChart({ data }) {
  if (!data) return null

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'ยอดขาย',
        data: data.units,
        borderColor: '#1B7A3F',
        backgroundColor: 'rgba(27,122,63,0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: '#1B7A3F',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
        ยอดขายรายสัปดาห์
      </h3>
      <div style={{ height: 200 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
