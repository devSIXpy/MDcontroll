import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Finances
export const getTransactions = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  return api.get('/finances/transactions', { params }).then(r => r.data)
}

export const createTransaction = (data) =>
  api.post('/finances/transactions', data).then(r => r.data)

export const updateTransaction = (id, data) =>
  api.put(`/finances/transactions/${id}`, data).then(r => r.data)

export const deleteTransaction = (id) =>
  api.delete(`/finances/transactions/${id}`)

export const getCategories = (type) =>
  api.get('/finances/categories', { params: type ? { type } : {} }).then(r => r.data)

export const createCategory = (data) =>
  api.post('/finances/categories', data).then(r => r.data)

export const getMonthlyBalance = (year) =>
  api.get('/finances/summary/monthly', { params: { year } }).then(r => r.data)

export const getSummary = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  return api.get('/finances/summary', { params }).then(r => r.data)
}

// Tasks
export const getTasks = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  return api.get('/tasks', { params }).then(r => r.data)
}

export const createTask = (data) =>
  api.post('/tasks', data).then(r => r.data)

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then(r => r.data)

export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then(r => r.data)

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`)

export const getTaskProjects = () =>
  api.get('/tasks/projects').then(r => r.data)

// Ideas
export const getIdeas = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  return api.get('/ideas', { params }).then(r => r.data)
}

export const createIdea = (data) =>
  api.post('/ideas', data).then(r => r.data)

export const updateIdea = (id, data) =>
  api.put(`/ideas/${id}`, data).then(r => r.data)

export const updateIdeaStatus = (id, status) =>
  api.patch(`/ideas/${id}/status`, { status }).then(r => r.data)

export const deleteIdea = (id) =>
  api.delete(`/ideas/${id}`)

export const getIdeaCategories = () =>
  api.get('/ideas/categories').then(r => r.data)

// Dashboard
export const getDashboardSummary = () =>
  api.get('/dashboard/summary').then(r => r.data)

export default api
