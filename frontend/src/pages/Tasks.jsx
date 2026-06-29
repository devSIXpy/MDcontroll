import { useState, useEffect, useCallback } from 'react'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'
import Button from '../components/ui/Button'
import { getTasks, deleteTask, updateTaskStatus, getTaskProjects } from '../services/api'

const EMPTY_FILTERS = { status: '', priority: '', project: '' }

function StatsBar({ tasks }) {
  const total = tasks.filter(t => t.status !== 'cancelled').length
  const done = tasks.filter(t => t.status === 'done').length
  const overdue = tasks.filter(t => {
    const today = new Date().toISOString().slice(0, 10)
    return t.due_date && t.due_date < today && t.status !== 'done' && t.status !== 'cancelled'
  }).length

  return (
    <div className="flex gap-4">
      <span className="text-xs text-text-secondary">{total} tarefa{total !== 1 ? 's' : ''}</span>
      {done > 0 && <span className="text-xs text-success">{done} concluída{done !== 1 ? 's' : ''}</span>}
      {overdue > 0 && <span className="text-xs text-danger">{overdue} atrasada{overdue !== 1 ? 's' : ''}</span>}
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTasks(filters)
      setTasks(data)
    } catch {
      setError('Erro ao carregar tarefas.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  useEffect(() => {
    getTaskProjects().then(setProjects).catch(() => {})
  }, [tasks])

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditing(null)
    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditing(task)
    setFormOpen(true)
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Excluir "${task.title}"?`)) return
    try {
      await deleteTask(task.id)
      fetchTasks()
    } catch {
      alert('Erro ao excluir tarefa.')
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTaskStatus(task.id, newStatus)
      fetchTasks()
    } catch {
      alert('Erro ao atualizar status.')
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-primary font-bold text-2xl">Tarefas</h1>
            <StatsBar tasks={tasks} />
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            + Nova tarefa
          </Button>
        </div>

        <TaskFilters
          filters={filters}
          projects={projects}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
            {error}
          </p>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      {formOpen && (
        <TaskForm
          task={editing}
          onSuccess={handleFormSuccess}
          onClose={() => { setFormOpen(false); setEditing(null) }}
        />
      )}
    </>
  )
}
