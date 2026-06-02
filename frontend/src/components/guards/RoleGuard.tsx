import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types/user'
import type { ReactNode } from 'react'

export function RoleGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: Role[] }) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <>{children}</>
}
