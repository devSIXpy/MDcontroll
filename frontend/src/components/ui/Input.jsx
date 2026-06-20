export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-text-secondary font-medium uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`
          bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-primary
          placeholder:text-text-secondary
          focus:outline-none focus:border-accent
          transition-colors
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
