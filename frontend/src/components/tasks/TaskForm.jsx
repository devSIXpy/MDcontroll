import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { createTask, updateTask } from '../../services/api'
import { todayISO } from '../../utils/format'

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  is_recurring: false,
  recurrence: '',
  project: '',
}

const selectClass =
  'bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors w-full'

export default function TaskForm({ task, onSuccess, onClose }) {
  const isEdit = Boolean(task)

  const [form, setForm] = useState(
    isEdit
      ? {
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date ?? '',
          is_recurring: task.is_recurring,
          recurrence: task.recurrence ?? '',
          project: task.project ?? '',
        }
      : EMPTY_FORM
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        description: form.description || null,
        due_date: form.due_date || null,
        recurrence: form.is_recurring && form.recurrence ? form.recurrence : null,
        project: form.project || null,
      }
      if (isEdit) {
        await updateTask(task.id, payload)
      } else {
        await createTask(payload)
      }
      onSuccess()
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(Array.isArray(detail) ? detail[0]?.msg : detail ?? 'Erro ao salvar tarefa')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Editar tarefa' : 'Nova tarefa'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          type="text"
          required
          placeholder="O que precisa ser feito?"
          value={form.title}
          onChange={set('title')}
        />

        <Input
          label="Descrição (opcional)"
          type="text"
          placeholder="Detalhes adicionais..."
          value={form.description}
          onChange={set('description')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">Prioridade</label>
            <select value={form.priority} onChange={set('priority')} className={selectClass}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">Status</label>
            <select value={form.status} onChange={set('status')} className={selectClass}>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="done">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prazo (opcional)"
            type="date"
            value={form.due_date}
            onChange={set('due_date')}
          />

          <Input
            label="Projeto (opcional)"
            type="text"
            placeholder="Ex: Trabalho, Pessoal..."
            value={form.project}
            onChange={set('project')}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={set('is_recurring')}
            className="accent-accent w-4 h-4"
          />
          <span className="text-sm text-text-primary">Tarefa recorrente</span>
        </label>

        {form.is_recurring && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">Recorrência</label>
            <select value={form.recurrence} onChange={set('recurrence')} className={selectClass}>
              <option value="">Selecione...</option>
              <option value="daily">Diária</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
        )}

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
