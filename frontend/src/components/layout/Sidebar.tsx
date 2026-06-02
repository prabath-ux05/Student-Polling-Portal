import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  MessageSquareText,
  ClipboardList,
  BarChart3,
  Download,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const facultyNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/questions', label: 'Questions', icon: MessageSquareText },
  { to: '/app/responses', label: 'Responses', icon: ClipboardList },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/export', label: 'Export', icon: Download },
]

const studentNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/questions', label: 'Questions', icon: MessageSquareText },
]

export function Sidebar() {
  const { user } = useAuth()
  const navItems = user?.role === 'FACULTY' ? facultyNav : studentNav

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
      <div className="flex flex-col flex-grow border-r bg-card pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">EduResponse</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">Academic Feedback</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          <p className="text-xs text-muted-foreground truncate">
            Signed in as <span className="font-medium text-foreground">{user?.username}</span>
          </p>
          <p className="text-[11px] text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
        </div>
      </div>
    </aside>
  )
}
