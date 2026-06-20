import { NavLink } from 'react-router-dom'

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
)

const IconFinances = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M14.8 9a2 2 0 0 0-1.8-1H11a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2.2A2 2 0 0 1 9 15M12 7v10" />
  </svg>
)

const IconTasks = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

const IconIdeas = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8a6 6 0 0 0-12 0 4.65 4.65 0 0 0 1.5 3.5c.76.76 1.23 1.52 1.41 2.5" />
  </svg>
)

const navItems = [
  { to: '/',         label: 'Dashboard', Icon: IconDashboard },
  { to: '/finances', label: 'Finanças',  Icon: IconFinances  },
  { to: '/tasks',    label: 'Tarefas',   Icon: IconTasks     },
  { to: '/ideas',    label: 'Ideias',    Icon: IconIdeas     },
]

export default function Sidebar() {
  return (
    <aside className="w-52 shrink-0 bg-surface border-r border-border flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-border">
        <span className="font-bold text-text-primary text-lg tracking-tight">MD</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-accent/10 text-accent'
                 : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
               }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
