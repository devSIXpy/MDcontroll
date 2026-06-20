import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Finances from './pages/Finances'
import Tasks from './pages/Tasks'
import Ideas from './pages/Ideas'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ideas" element={<Ideas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
