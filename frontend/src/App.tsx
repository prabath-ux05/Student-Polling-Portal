import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { RoleGuard } from '@/components/guards/RoleGuard'
import { AppShell } from '@/components/layout/AppShell'

import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import QuestionsListPage from '@/features/questions/QuestionsListPage'
import ResponseSubmitPage from '@/features/responses/ResponseSubmitPage'
import ResponsesListPage from '@/features/responses/ResponsesListPage'
import AnalyticsDashboard from '@/features/analytics/AnalyticsDashboard'
import ExportPage from '@/features/exports/ExportPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/app"
              element={
                <AuthGuard>
                  <AppShell />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="questions" element={<QuestionsListPage />} />
              <Route
                path="questions/:id/respond"
                element={
                  <RoleGuard allowedRoles={['STUDENT']}>
                    <ResponseSubmitPage />
                  </RoleGuard>
                }
              />
              <Route
                path="responses"
                element={
                  <RoleGuard allowedRoles={['FACULTY']}>
                    <ResponsesListPage />
                  </RoleGuard>
                }
              />
              <Route
                path="analytics"
                element={
                  <RoleGuard allowedRoles={['FACULTY']}>
                    <AnalyticsDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="export"
                element={
                  <RoleGuard allowedRoles={['FACULTY']}>
                    <ExportPage />
                  </RoleGuard>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
