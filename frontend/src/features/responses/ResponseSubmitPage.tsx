import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchQuestion } from '@/api/questions'
import { submitResponse } from '@/api/responses'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react'

export default function ResponseSubmitPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { data: question, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => fetchQuestion(Number(id)),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: submitResponse,
    onSuccess: () => setSubmitted(true),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!id || !answer.trim()) return
    mutation.mutate({ question: Number(id), answer_text: answer })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Response Submitted!</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Your response has been recorded successfully.
            </p>
            <Button onClick={() => navigate('/app/questions')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/app/questions')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Questions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{question?.title}</CardTitle>
          <CardDescription>{question?.description || 'No additional details.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mutation.isError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                Failed to submit. Please try again.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="answer">Your Response</Label>
              <Textarea
                id="answer"
                placeholder="Type your response here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground text-right">{answer.length} characters</p>
            </div>

            <Button type="submit" className="w-full" disabled={!answer.trim() || mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
