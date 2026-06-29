export default function TaskFilters({ filters, projects, onChange, onClear }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  const selectClass =
    'bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors'

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary uppercase tracking-wide">Status</label>
        <select value={filters.status} onChange={set('status')} className={selectClass}>
          <option value="">Todos</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary uppercase tracking-wide">Prioridade</label>
        <select value={filters.priority} onChange={set('priority')} className={selectClass}>
          <option value="">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      {projects.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary uppercase tracking-wide">Projeto</label>
          <select value={filters.project} onChange={set('project')} className={selectClass}>
            <option value="">Todos</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {(filters.status || filters.priority || filters.project) && (
        <button
          onClick={onClear}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors pb-2"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
