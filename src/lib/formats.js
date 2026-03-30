export function formatPrice(num) {
  if (typeof num === 'string') num = parseFloat(num.replace(/[^0-9.]/g, ''))
  return '฿' + num.toLocaleString('th-TH')
}

export function formatNumber(num) {
  return num.toLocaleString('th-TH')
}

export function formatCurrency(num) {
  if (num >= 1000000) return '฿' + (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return '฿' + (num / 1000).toFixed(0) + 'K'
  return '฿' + num.toLocaleString('th-TH')
}

export function monthlyPayment(principal, annualRate, months) {
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export function parseThaiPrice(str) {
  if (typeof str === 'number') return str
  return parseFloat(str.replace(/[^0-9.]/g, ''))
}

export function flatRateMonthly(principal, annualRatePercent, months) {
  if (!principal || !months) return 0
  const rate = (annualRatePercent || 0) / 100
  const years = months / 12
  const totalInterest = principal * rate * years
  const totalLoan = principal + totalInterest
  return Math.ceil(totalLoan / months)
}
