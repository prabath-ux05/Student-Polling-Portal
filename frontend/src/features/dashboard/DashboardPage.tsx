import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { fetchQuestions } from '@/api/questions'
import { fetchResponses } from '@/api/responses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareText, ClipboardList, Users, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function StatCard({ title, value, icon: Icon, color, onClick }: {
  title: string
  value: number
  icon: React.ElementType
  color: string
  onClick?: () => void
}) {
  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isFaculty = user?.role === 'FACULTY'

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

  const { data: responses = [] } = useQuery({
    queryKey: ['responses'],
    queryFn: fetchResponses,
  })

  const uniqueStudents = new Set(responses.map((r) => r.student)).size

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.username} 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {isFaculty
            ? 'Here\'s an overview of your feedback activity.'
            : 'Check out the latest questions from your faculty.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Questions"
          value={questions.length}
          icon={MessageSquareText}
          color="bg-primary/10 text-primary"
          onClick={() => navigate('/app/questions')}
        />
        <StatCard
          title="Total Responses"
          value={responses.length}
          icon={ClipboardList}
          color="bg-purple-500/10 text-purple-500"
          onClick={isFaculty ? () => navigate('/app/responses') : undefined}
        />
        {isFaculty && (
          <>
            <StatCard
              title="Unique Students"
              value={uniqueStudents}
              icon={Users}
              color="bg-cyan-500/10 text-cyan-500"
            />
            <StatCard
              title="Avg Responses / Q"
              value={questions.length ? Math.round(responses.length / questions.length) : 0}
              icon={BarChart3}
              color="bg-amber-500/10 text-amber-500"
              onClick={() => navigate('/app/analytics')}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      {isFaculty && responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Responses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {responses.slice(0, 5).map((r) => {
                const question = questions.find((q) => q.id === r.question)
                return (
                  <div key={r.id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{question?.title || `Q#${r.question}`}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{r.answer_text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      Student #{r.student}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
