import { useQuery } from '@tanstack/react-query'
import { fetchPieData, fetchBarData, fetchHistogramData } from '@/api/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const COLORS = ['#4F46E5', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#22C55E', '#EC4899', '#14B8A6']

export default function AnalyticsDashboard() {
  const { data: pieData, isLoading: loadingPie } = useQuery({
    queryKey: ['analytics-pie'],
    queryFn: fetchPieData,
  })

  const { data: barData, isLoading: loadingBar } = useQuery({
    queryKey: ['analytics-bar'],
    queryFn: fetchBarData,
  })

  const { data: histData, isLoading: loadingHist } = useQuery({
    queryKey: ['analytics-histogram'],
    queryFn: fetchHistogramData,
  })

  const isLoading = loadingPie || loadingBar || loadingHist

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Transform pie data for Recharts
  const pieChartData = pieData?.labels.map((label, i) => ({
    name: label,
    value: pieData.series[i],
  })) || []

  // Transform bar data for Recharts
  const barChartData = barData?.labels.map((label, i) => ({
    name: label.length > 20 ? label.slice(0, 20) + '…' : label,
    responses: barData.series[0]?.data[i] ?? 0,
  })) || []

  // Transform histogram data for Recharts
  const histChartData = histData?.labels.map((label, i) => ({
    range: label,
    count: histData.series[0]?.data[i] ?? 0,
  })) || []

  const hasData = pieChartData.some((d) => d.value > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Visual insights into student engagement and responses
        </p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-1">No data to visualize</h3>
            <p className="text-sm text-muted-foreground">Analytics will appear once students start responding.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Response Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value: string) => (
                      <span className="text-foreground">{value.length > 25 ? value.slice(0, 25) + '…' : value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Question-wise Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" fontSize={11} tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <YAxis fontSize={11} tick={{ fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="responses" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Histogram */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Response Length Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={histChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="range" fontSize={12} tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <YAxis fontSize={12} tick={{ fill: 'var(--color-muted-foreground)' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
