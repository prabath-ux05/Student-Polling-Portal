import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/api/questions'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, MessageSquareText, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import type { Question } from '@/types/question'

export default function QuestionsListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isFaculty = user?.role === 'FACULTY'

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

  const createMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      closeDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; description: string } }) =>
      updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      closeDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
  })

  const openCreate = () => {
    setEditingQuestion(null)
    setTitle('')
    setDescription('')
    setDialogOpen(true)
  }

  const openEdit = (q: Question) => {
    setEditingQuestion(q)
    setTitle(q.title)
    setDescription(q.description)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingQuestion(null)
    setTitle('')
    setDescription('')
  }

  const handleSubmit = () => {
    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion.id, data: { title, description } })
    } else {
      createMutation.mutate({ title, description })
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Questions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isFaculty ? 'Create and manage feedback questions' : 'Browse questions and submit your responses'}
          </p>
        </div>
        {isFaculty && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Question
          </Button>
        )}
      </div>

      {/* Question List */}
      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <MessageSquareText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No questions yet</h3>
            <p className="text-sm text-muted-foreground">
              {isFaculty ? 'Create your first question to get started.' : 'Your faculty hasn\'t posted any questions yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((q) => (
            <Card key={q.id} className="group hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base leading-snug">{q.title}</CardTitle>
                  {isFaculty && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(q)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(q.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2">{q.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{formatDate(q.created_at)}</span>
                  {!isFaculty && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/app/questions/${q.id}/respond`)}>
                      Respond
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create Question'}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Update the question details below.' : 'Add a new feedback question for your students.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="q-title">Title</Label>
              <Input id="q-title" placeholder="Enter question title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-desc">Description</Label>
              <Textarea id="q-desc" placeholder="Provide additional details..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!title.trim() || isMutating}>
                {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : editingQuestion ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
