export interface Question {
  id: number
  title: string
  description: string
  created_by: number
  created_at: string
}

export interface QuestionCreateRequest {
  title: string
  description: string
}
