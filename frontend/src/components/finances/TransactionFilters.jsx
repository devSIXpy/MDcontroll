import Input from '../ui/Input'
import Button from '../ui/Button'

export default function TransactionFilters({ filters, categories, onChange, onClear }) {
  const handleChange = (field, value) => onChange({ ...filters, [field]: value })

  const hasActiveFilters = filters.start_date || filters.end_date || filters.category_id

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-wrap gap-3 items-end">
      <Input
        label="De"
        type="date"
        value={filters.start_date}
        onChange={(e) => handleChange('start_date', e.target.value)}
        className="w-36"
      />
      <Input
        label="Até"
        type="date"
        value={filters.end_date}
        onChange={(e) => handleChange('end_date', e.target.value)}
        className="w-36"
      />
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
          Categoria
        </label>
        <select
          value={filters.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          className="bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors w-44"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
