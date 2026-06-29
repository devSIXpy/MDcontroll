import IdeaItem from './IdeaItem'

export default function IdeaList({ ideas, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-text-secondary text-sm">
        Carregando...
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-secondary">
        <span className="text-sm">Nenhuma ideia encontrada.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {ideas.map((idea) => (
        <IdeaItem key={idea.id} idea={idea} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
