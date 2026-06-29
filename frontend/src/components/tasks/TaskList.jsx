import TaskItem from './TaskItem'

export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-text-secondary text-sm">
        Carregando...
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-secondary">
        <span className="text-sm">Nenhuma tarefa encontrada.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
