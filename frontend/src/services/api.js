import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

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

export default api
