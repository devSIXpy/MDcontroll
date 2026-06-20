export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatDate = (dateStr) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')

export const todayISO = () => new Date().toISOString().slice(0, 10)
