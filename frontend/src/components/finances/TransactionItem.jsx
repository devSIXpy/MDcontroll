import Button from '../ui/Button'
import { formatCurrency, formatDate } from '../../utils/format'

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'
  const amountColor = isIncome ? 'text-success' : 'text-danger'

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: transaction.category.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-primary font-medium truncate">
            {transaction.description || transaction.category.name}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded shrink-0"
            style={{
              backgroundColor: transaction.category.color + '20',
              color: transaction.category.color,
            }}
          >
            {transaction.category.name}
          </span>
        </div>
        <span className="text-xs text-text-secondary">{formatDate(transaction.date)}</span>
      </div>
      <span className={`font-mono text-sm font-medium shrink-0 ${amountColor}`}>
        {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
      </span>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)}>
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(transaction)}>
          <span className="text-danger">Excluir</span>
        </Button>
      </div>
    </div>
  )
}
