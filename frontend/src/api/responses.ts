import api from './client'
import type { StudentResponse, ResponseCreateRequest } from '@/types/response'

export async function fetchResponses(): Promise<StudentResponse[]> {
  const res = await api.get<StudentResponse[]>('/responses/')
  return res.data
}

export async function submitResponse(data: ResponseCreateRequest): Promise<StudentResponse> {
  const res = await api.post<StudentResponse>('/responses/', data)
  return res.data
}
