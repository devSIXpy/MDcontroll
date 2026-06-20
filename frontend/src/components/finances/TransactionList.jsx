import TransactionItem from './TransactionItem'

export default function TransactionList({ transactions, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-secondary text-sm">
        Carregando...
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-secondary text-sm">
        Nenhuma transação encontrada.
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg px-4">
      {transactions.map((t) => (
        <TransactionItem
          key={t.id}
          transaction={t}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
