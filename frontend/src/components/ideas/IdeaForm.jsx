import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { createIdea, updateIdea } from '../../services/api'

const EMPTY_FORM = {
  title: '',
  body: '',
  status: 'raw',
  category: '',
  linked_task_id: '',
}

const selectClass =
  'bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors w-full'

export default function IdeaForm({ idea, onSuccess, onClose }) {
  const isEdit = Boolean(idea)

  const [form, setForm] = useState(
    isEdit
      ? {
          title: idea.title,
          body: idea.body ?? '',
          status: idea.status,
          category: idea.category ?? '',
          linked_task_id: idea.linked_task_id ? String(idea.linked_task_id) : '',
        }
      : EMPTY_FORM
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        body: form.body || null,
        category: form.category || null,
        linked_task_id: form.linked_task_id ? Number(form.linked_task_id) : null,
      }
      if (isEdit) {
        await updateIdea(idea.id, payload)
      } else {
        await createIdea(payload)
      }
      onSuccess()
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(Array.isArray(detail) ? detail[0]?.msg : detail ?? 'Erro ao salvar ideia')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Editar ideia' : 'Nova ideia'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          type="text"
          required
          placeholder="Qual é a ideia?"
          value={form.title}
          onChange={set('title')}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
            Corpo (Markdown)
          </label>
          <textarea
            rows={6}
            placeholder="Detalhe sua ideia aqui... Suporta Markdown."
            value={form.body}
            onChange={set('body')}
            className="bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors resize-y min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">Status</label>
            <select value={form.status} onChange={set('status')} className={selectClass}>
              <option value="raw">Bruta</option>
              <option value="refining">Refinando</option>
              <option value="planning">Planejando</option>
              <option value="executing">Executando</option>
              <option value="archived">Arquivada</option>
            </select>
          </div>

          <Input
            label="Categoria (opcional)"
            type="text"
            placeholder="Ex: Produto, Código..."
            value={form.category}
            onChange={set('category')}
          />
        </div>

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
