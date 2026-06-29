import { useState, useEffect } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getMonthlyBalance } from '../../services/api'
import { formatCurrency } from '../../utils/format'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const currentYear = new Date().getFullYear()
const YEAR_OPTIONS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

function yAxisFormatter(v) {
  if (v === 0) return 'R$0'
  const abs = Math.abs(v)
  if (abs >= 1000) return `R$${(v / 1000).toFixed(0)}k`
  return `R$${v}`
}

function MetricCard({ label, value, colorClass }) {
  return (
    <div className="bg-surface-alt border border-border rounded-lg px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-text-secondary uppercase tracking-wide">{label}</span>
      <span className={`font-mono text-lg font-bold ${colorClass}`}>{formatCurrency(value)}</span>
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-sm">
      <p className="text-text-secondary mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-mono text-text-primary">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBalanceChart() {
  const [year, setYear] = useState(currentYear)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMonthlyBalance(year)
      .then((rows) => setData(rows.map((r) => ({ ...r, name: MONTHS[r.month - 1] }))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [year])

  const totals = data.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expense: acc.expense + r.expense,
      balance: acc.balance + r.balance,
    }),
    { income: 0, expense: 0, balance: 0 }
  )

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-text-primary font-bold text-lg">Balanço Mensal</h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-surface-alt border border-border text-text-primary rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Receitas no ano" value={totals.income} colorClass="text-success" />
        <MetricCard label="Despesas no ano" value={totals.expense} colorClass="text-danger" />
        <MetricCard
          label="Saldo do ano"
          value={totals.balance}
          colorClass={totals.balance >= 0 ? 'text-success' : 'text-danger'}
        />
      </div>

      {loading ? (
        <div className="h-56 flex items-center justify-center text-text-secondary text-sm">
          Carregando...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#888888', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#888888', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisFormatter}
              width={58}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: '#888888' }}>{value}</span>}
            />
            <Bar dataKey="income" name="Receita" fill="#3DAA6D" radius={[3, 3, 0, 0]} maxBarSize={24} />
            <Bar dataKey="expense" name="Despesa" fill="#E05C5C" radius={[3, 3, 0, 0]} maxBarSize={24} />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#6C63FF"
              strokeWidth={2}
              dot={{ r: 3, fill: '#6C63FF', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6C63FF' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
