import { formatDate } from '../../utils/format'

const STATUS_LABEL = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  done: 'Concluído',
  cancelled: 'Cancelado',
}

const STATUS_COLOR = {
  pending: 'text-text-secondary',
  in_progress: 'text-accent',
  done: 'text-success',
  cancelled: 'text-text-secondary opacity-50',
}

const PRIORITY_COLOR = {
  high: 'text-danger',
  medium: 'text-warning',
  low: 'text-text-secondary',
}

const PRIORITY_LABEL = { high: 'Alta', medium: 'Média', low: 'Baixa' }

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const today = new Date().toISOString().slice(0, 10)
  const isOverdue =
    task.due_date &&
    task.due_date < today &&
    task.status !== 'done' &&
    task.status !== 'cancelled'

  const nextStatus = {
    pending: 'in_progress',
    in_progress: 'done',
    done: 'pending',
    cancelled: 'pending',
  }

  return (
    <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-start gap-3 hover:border-border/80 transition-colors">
      <button
        onClick={() => onStatusChange(task, nextStatus[task.status])}
        title="Mudar status"
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
          task.status === 'done'
            ? 'bg-success border-success'
            : task.status === 'in_progress'
            ? 'border-accent bg-accent/20'
            : 'border-border hover:border-accent'
        }`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${
              task.status === 'done' ? 'line-through text-text-secondary' : 'text-text-primary'
            }`}
          >
            {task.title}
          </span>

          <span className={`text-xs ${PRIORITY_COLOR[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>

          <span className={`text-xs ${STATUS_COLOR[task.status]}`}>
            {STATUS_LABEL[task.status]}
          </span>

          {isOverdue && (
            <span className="text-xs text-danger font-medium">Atrasado</span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-text-secondary mt-0.5 truncate">{task.description}</p>
        )}

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {task.due_date && (
            <span className={`text-xs ${isOverdue ? 'text-danger' : 'text-text-secondary'}`}>
              Prazo: {formatDate(task.due_date)}
            </span>
          )}
          {task.project && (
            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
              {task.project}
            </span>
          )}
          {task.is_recurring && task.recurrence && (
            <span className="text-xs text-text-secondary">
              Recorrente: {task.recurrence === 'daily' ? 'diário' : task.recurrence === 'weekly' ? 'semanal' : 'mensal'}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded hover:bg-surface-alt"
          title="Editar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-text-secondary hover:text-danger transition-colors p-1.5 rounded hover:bg-surface-alt"
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
    </div>
  )
}
