import { Navigate, Outlet } from 'react-router-dom'
import { useMe } from '../../features/auth/apiHooks'

export default function ProtectedRoute() {
  const { data: user, isLoading, isFetching } = useMe()

  // Show a minimal spinner while the /me check is in-flight
  if (isLoading || isFetching) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050a14',
        }}
      >
        <svg
          className="animate-spin"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0,212,255,0.7)"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
