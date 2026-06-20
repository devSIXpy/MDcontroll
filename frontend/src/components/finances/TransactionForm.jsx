import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { createTransaction, updateTransaction } from '../../services/api'
import { todayISO } from '../../utils/format'

const EMPTY_FORM = {
  type: 'expense',
  amount: '',
  category_id: '',
  description: '',
  date: todayISO(),
}

export default function TransactionForm({ transaction, categories, onSuccess, onClose }) {
  const isEdit = Boolean(transaction)

  const [form, setForm] = useState(
    isEdit
      ? {
          type: transaction.type,
          amount: String(transaction.amount),
          category_id: String(transaction.category_id),
          description: transaction.description ?? '',
          date: transaction.date,
        }
      : EMPTY_FORM
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const filteredCategories = categories.filter((c) => c.type === form.type)

  useEffect(() => {
    const current = categories.find((c) => c.id === Number(form.category_id))
    if (current && current.type !== form.type) {
      setForm((prev) => ({ ...prev, category_id: '' }))
    }
  }, [form.type, form.category_id, categories])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        category_id: Number(form.category_id),
        description: form.description || null,
      }
      if (isEdit) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload)
      }
      onSuccess()
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(Array.isArray(detail) ? detail[0]?.msg : detail ?? 'Erro ao salvar transação')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Editar transação' : 'Nova transação'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: t }))}
              className={`
                flex-1 py-2 rounded text-sm font-medium border transition-colors
                ${form.type === t
                  ? t === 'income'
                    ? 'bg-success/10 border-success text-success'
                    : 'bg-danger/10 border-danger text-danger'
                  : 'border-border text-text-secondary hover:bg-surface-alt'
                }
              `}
            >
              {t === 'income' ? 'Receita' : 'Despesa'}
            </button>
          ))}
        </div>

        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="0,00"
          value={form.amount}
          onChange={set('amount')}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
            Categoria
          </label>
          <select
            required
            value={form.category_id}
            onChange={set('category_id')}
            className="bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Selecione...</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Descrição (opcional)"
          type="text"
          placeholder="Ex: Almoço, Conta de luz..."
          value={form.description}
          onChange={set('description')}
        />

        <Input
          label="Data"
          type="date"
          required
          value={form.date}
          onChange={set('date')}
        />

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
