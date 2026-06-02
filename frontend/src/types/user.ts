export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN'

export interface User {
  id: number
  username: string
  email: string
  role: Role
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: Role
}
