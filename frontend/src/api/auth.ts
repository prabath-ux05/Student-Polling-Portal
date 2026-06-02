import api from './client'
import type { AuthTokens, LoginRequest, RegisterRequest, User } from '@/types/user'

export async function login(data: LoginRequest): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>('/auth/login/', data)
  return res.data
}

export async function register(data: RegisterRequest): Promise<User> {
  const res = await api.post<User>('/auth/register/', data)
  return res.data
}

export async function getProfile(): Promise<User> {
  const res = await api.get<User>('/auth/profile/')
  return res.data
}
