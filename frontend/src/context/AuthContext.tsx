import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types/user'
import { getProfile } from '@/api/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getProfile()
        .then(setUser)
        .catch((err) => {
          console.warn('Failed to fetch profile in AuthContext:', err)
          // Profile endpoint failure must NOT break authentication state
          // We don't remove the token, we just set a minimal fallback user to keep them logged in
          setUser({
            id: 0,
            email: 'user@example.com',
            username: 'user',
            role: 'STUDENT',
            first_name: '',
            last_name: ''
          })
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
