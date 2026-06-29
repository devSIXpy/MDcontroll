import { useState, useEffect, useCallback } from 'react'
import IdeaForm from '../components/ideas/IdeaForm'
import IdeaList from '../components/ideas/IdeaList'
import Button from '../components/ui/Button'
import { getIdeas, deleteIdea } from '../services/api'

const EMPTY_FILTERS = { status: '', category: '' }

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'raw', label: 'Bruta' },
  { value: 'refining', label: 'Refinando' },
  { value: 'planning', label: 'Planejando' },
  { value: 'executing', label: 'Executando' },
  { value: 'archived', label: 'Arquivada' },
]

const selectClass =
  'bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors'

export default function Ideas() {
  const [ideas, setIdeas] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [quickTitle, setQuickTitle] = useState('')

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setIdeas(await getIdeas(filters))
    } catch {
      setError('Erro ao carregar ideias.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchIdeas() }, [fetchIdeas])

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditing(null)
    fetchIdeas()
  }

  const handleEdit = (idea) => {
    setEditing(idea)
    setFormOpen(true)
  }

  const handleDelete = async (idea) => {
    if (!window.confirm(`Excluir "${idea.title}"?`)) return
    try {
      await deleteIdea(idea.id)
      fetchIdeas()
    } catch {
      alert('Erro ao excluir ideia.')
    }
  }

  const handleQuickCapture = (e) => {
    if (e.key === 'Enter' && quickTitle.trim()) {
      setEditing({ _quickTitle: quickTitle.trim() })
      setQuickTitle('')
      setFormOpen(true)
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-text-primary font-bold text-2xl">Ideias</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            + Nova ideia
          </Button>
        </div>

        <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8a6 6 0 0 0-12 0 4.65 4.65 0 0 0 1.5 3.5c.76.76 1.23 1.52 1.41 2.5" />
          </svg>
          <input
            type="text"
            placeholder="Captura rápida — digite e pressione Enter"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={handleQuickCapture}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </div>

        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary uppercase tracking-wide">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className={selectClass}
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {(filters.status || filters.category) && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors pb-2"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
            {error}
          </p>
        )}

        <IdeaList
          ideas={ideas}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {formOpen && (
        <IdeaForm
          idea={editing?._quickTitle ? { title: editing._quickTitle } : editing}
          onSuccess={handleFormSuccess}
          onClose={() => { setFormOpen(false); setEditing(null) }}
        />
      )}
    </>
  )
}
