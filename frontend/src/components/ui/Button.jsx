const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  danger: 'bg-danger hover:opacity-80 text-white',
  ghost: 'bg-transparent hover:bg-surface-alt text-text-secondary hover:text-text-primary',
  outline: 'border border-border bg-transparent hover:bg-surface-alt text-text-primary',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm'
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 rounded font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizeClass} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
