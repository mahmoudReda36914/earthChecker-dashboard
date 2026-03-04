import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

/* ── Auth feature ── */
import LoginPage          from './features/auth/pages/LoginPage'
import SignupPage         from './features/auth/pages/SignupPage'
import VerifyEmailPage    from './features/auth/pages/VerifyEmailPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage  from './features/auth/pages/ResetPasswordPage'

/* ── Other feature pages ── */
import OverviewPage     from './features/overview/pages/OverviewPage'
import ModulesPage      from './features/modules/pages/ModulesPage'
import UpdateModulePage from './features/modules/pages/UpdateModulePage'
import FormsBuilderPage from './features/forms/pages/FormsBuilderPage'
import FormPreviewPage  from './features/forms/pages/FormPreviewPage'
import AIAgentsPage     from './features/agents/pages/AIAgentsPage'
import CreateAgentPage  from './features/agents/pages/CreateAgentPage'
import UpdateAgentPage  from './features/agents/pages/UpdateAgentPage'
import CyclesPage       from './features/cycles/pages/CyclesPage'
import SubmissionsPage  from './features/submissions/pages/SubmissionsPage'
import SettingsPage     from './features/settings/pages/SettingsPage'

/* ── Layout & auth guard ── */
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute  from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login"                   element={<LoginPage />} />
        <Route path="/signup"                  element={<SignupPage />} />
        <Route path="/verify-email/:token"     element={<VerifyEmailPage />} />
        <Route path="/forgot-password"         element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token"   element={<ResetPasswordPage />} />

        {/* Standalone — no dashboard chrome */}
        <Route path="/form-preview" element={<FormPreviewPage />} />

        {/* Protected dashboard — requires valid session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"              element={<OverviewPage />} />
            <Route path="modules"               element={<ModulesPage />} />
            <Route path="modules/:id/update"    element={<UpdateModulePage />} />
            <Route path="forms"                 element={<FormsBuilderPage />} />
            <Route path="agents"                element={<AIAgentsPage />} />
            <Route path="agents/create"         element={<CreateAgentPage />} />
            <Route path="agents/:id/update"     element={<UpdateAgentPage />} />
            <Route path="cycles"                element={<CyclesPage />} />
            <Route path="submissions"           element={<SubmissionsPage />} />
            <Route path="settings"              element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
