import { useState, useEffect, useCallback } from 'react'
import TransactionFilters from '../components/finances/TransactionFilters'
import TransactionForm from '../components/finances/TransactionForm'
import TransactionList from '../components/finances/TransactionList'
import MonthlyBalanceChart from '../components/finances/MonthlyBalanceChart'
import Button from '../components/ui/Button'
import { getTransactions, getCategories, deleteTransaction } from '../services/api'
import { formatCurrency } from '../utils/format'

const EMPTY_FILTERS = { start_date: '', end_date: '', category_id: '' }

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4 flex flex-col gap-1">
      <span className="text-xs text-text-secondary uppercase tracking-wide">{label}</span>
      <span className={`font-mono text-xl font-bold ${color}`}>{formatCurrency(value)}</span>
    </div>
  )
}

export default function Finances() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTransactions(filters)
      setTransactions(data)
    } catch {
      setError('Erro ao carregar transações.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditing(null)
    fetchTransactions()
  }

  const handleEdit = (transaction) => {
    setEditing(transaction)
    setFormOpen(true)
  }

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Excluir "${transaction.description || transaction.category.name}"?`
    )
    if (!confirmed) return
    try {
      await deleteTransaction(transaction.id)
      fetchTransactions()
    } catch {
      alert('Erro ao excluir transação.')
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-text-primary font-bold text-2xl">Finanças</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            + Nova transação
          </Button>
        </div>

        <MonthlyBalanceChart />

        <div className="grid grid-cols-3 gap-3">
          <SummaryCard label="Receitas (filtro)" value={income} color="text-success" />
          <SummaryCard label="Despesas (filtro)" value={expense} color="text-danger" />
          <SummaryCard
            label="Saldo (filtro)"
            value={balance}
            color={balance >= 0 ? 'text-success' : 'text-danger'}
          />
        </div>

        <TransactionFilters
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
            {error}
          </p>
        )}

        <TransactionList
          transactions={transactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {formOpen && (
        <TransactionForm
          transaction={editing}
          categories={categories}
          onSuccess={handleFormSuccess}
          onClose={handleFormClose}
        />
      )}
    </>
  )
}
