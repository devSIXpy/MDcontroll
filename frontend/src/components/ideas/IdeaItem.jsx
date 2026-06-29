import { formatDate } from '../../utils/format'

const STATUS_LABEL = {
  raw: 'Bruta',
  refining: 'Refinando',
  planning: 'Planejando',
  executing: 'Executando',
  archived: 'Arquivada',
}

const STATUS_COLOR = {
  raw: 'text-text-secondary bg-surface-alt',
  refining: 'text-warning bg-warning/10',
  planning: 'text-accent bg-accent/10',
  executing: 'text-success bg-success/10',
  archived: 'text-text-secondary bg-surface-alt opacity-60',
}

export default function IdeaItem({ idea, onEdit, onDelete }) {
  return (
    <div
      className="bg-surface border border-border rounded-lg px-4 py-3 flex items-start gap-3 hover:border-border/80 transition-colors cursor-pointer"
      onClick={() => onEdit(idea)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text-primary">{idea.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[idea.status]}`}>
            {STATUS_LABEL[idea.status]}
          </span>
          {idea.category && (
            <span className="text-xs text-text-secondary bg-surface-alt px-2 py-0.5 rounded">
              {idea.category}
            </span>
          )}
        </div>

        {idea.body && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-2 font-mono">
            {idea.body}
          </p>
        )}

        <span className="text-xs text-text-secondary mt-1.5 block">
          {formatDate(idea.updated_at.slice(0, 10))}
        </span>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(idea) }}
        className="text-text-secondary hover:text-danger transition-colors p-1.5 rounded hover:bg-surface-alt flex-shrink-0"
        title="Excluir"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  )
}
