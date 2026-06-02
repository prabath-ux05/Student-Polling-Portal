import { useQuery } from '@tanstack/react-query'
import { fetchResponses } from '@/api/responses'
import { fetchQuestions } from '@/api/questions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Loader2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function ResponsesListPage() {
  const { data: responses = [], isLoading: loadingR } = useQuery({
    queryKey: ['responses'],
    queryFn: fetchResponses,
  })

  const { data: questions = [], isLoading: loadingQ } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

  const isLoading = loadingR || loadingQ
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q.title]))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Responses</h2>
        <p className="text-muted-foreground text-sm mt-1">
          View all submitted responses across questions
        </p>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No responses yet</h3>
            <p className="text-sm text-muted-foreground">Students haven't submitted any responses yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Responses ({responses.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-medium px-6 py-3 text-muted-foreground">ID</th>
                    <th className="text-left font-medium px-6 py-3 text-muted-foreground">Question</th>
                    <th className="text-left font-medium px-6 py-3 text-muted-foreground">Answer</th>
                    <th className="text-left font-medium px-6 py-3 text-muted-foreground">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">#{r.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate">
                        {questionMap[r.question] || `Q#${r.question}`}
                      </td>
                      <td className="px-6 py-4 max-w-[320px]">
                        <p className="line-clamp-2 text-muted-foreground">{r.answer_text}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-xs">
                        {formatDateTime(r.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
