import { useState, useEffect } from 'react'
import { getDashboardSummary } from '../services/api'
import { formatCurrency } from '../utils/format'

function StatCard({ label, value, sub, valueColor = 'text-text-primary' }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4 flex flex-col gap-1">
      <span className="text-xs text-text-secondary uppercase tracking-wide">{label}</span>
      <span className={`text-xl font-bold font-mono ${valueColor}`}>{value}</span>
      {sub && <span className="text-xs text-text-secondary">{sub}</span>}
    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-surface-alt rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full bg-accent transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

function StreakBadge({ days }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4 flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-text-secondary uppercase tracking-wide">Streak de uso</span>
        <span className="text-2xl font-bold text-warning font-mono">{days} dia{days !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: Math.min(days, 14) }).map((_, i) => (
          <div key={i} className="w-3 h-3 bg-warning/70 rounded-sm" />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setError('Erro ao carregar dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
        Carregando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
          {error}
        </p>
      </div>
    )
  }

  const { finance, tasks, ideas, streak_days, progress_index } = data

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-text-primary font-bold text-2xl">Dashboard</h1>

      <StreakBadge days={streak_days} />

      <section className="flex flex-col gap-3">
        <h2 className="text-text-secondary text-xs uppercase tracking-wide font-medium">
          Finanças — mês atual
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Receitas"
            value={formatCurrency(finance.total_income)}
            valueColor="text-success"
          />
          <StatCard
            label="Despesas"
            value={formatCurrency(finance.total_expense)}
            valueColor="text-danger"
          />
          <StatCard
            label="Saldo"
            value={formatCurrency(finance.balance)}
            valueColor={finance.balance >= 0 ? 'text-success' : 'text-danger'}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-text-secondary text-xs uppercase tracking-wide font-medium">
            Tarefas
          </h2>
          <span className="text-xs text-text-secondary">
            Progresso do mês: <span className="text-accent font-mono">{progress_index}%</span>
          </span>
        </div>
        <ProgressBar value={progress_index} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total ativas"
            value={tasks.total}
          />
          <StatCard
            label="Pendentes"
            value={tasks.pending}
            valueColor="text-text-secondary"
          />
          <StatCard
            label="Em andamento"
            value={tasks.in_progress}
            valueColor="text-accent"
          />
          <StatCard
            label="Atrasadas"
            value={tasks.overdue}
            valueColor={tasks.overdue > 0 ? 'text-danger' : 'text-text-secondary'}
          />
        </div>
        {tasks.done_this_month > 0 && (
          <p className="text-xs text-success">
            {tasks.done_this_month} tarefa{tasks.done_this_month !== 1 ? 's' : ''} concluída{tasks.done_this_month !== 1 ? 's' : ''} este mês
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-text-secondary text-xs uppercase tracking-wide font-medium">Ideias</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Total de ideias"
            value={ideas.total}
          />
          <StatCard
            label="Brutas (para refinar)"
            value={ideas.raw}
            valueColor={ideas.raw > 0 ? 'text-warning' : 'text-text-secondary'}
          />
        </div>
      </section>
    </div>
  )
}
