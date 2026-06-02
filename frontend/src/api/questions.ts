import api from './client'
import type { Question, QuestionCreateRequest } from '@/types/question'

export async function fetchQuestions(): Promise<Question[]> {
  const res = await api.get<Question[]>('/questions/')
  return res.data
}

export async function fetchQuestion(id: number): Promise<Question> {
  const res = await api.get<Question>(`/questions/${id}/`)
  return res.data
}

export async function createQuestion(data: QuestionCreateRequest): Promise<Question> {
  const res = await api.post<Question>('/questions/', data)
  return res.data
}

export async function updateQuestion(id: number, data: QuestionCreateRequest): Promise<Question> {
  const res = await api.put<Question>(`/questions/${id}/`, data)
  return res.data
}

export async function deleteQuestion(id: number): Promise<void> {
  await api.delete(`/questions/${id}/`)
}
