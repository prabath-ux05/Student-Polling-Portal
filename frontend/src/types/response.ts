export interface StudentResponse {
  id: number
  question: number
  student: number
  answer_text: string
  submitted_at: string
}

export interface ResponseCreateRequest {
  question: number
  answer_text: string
}
