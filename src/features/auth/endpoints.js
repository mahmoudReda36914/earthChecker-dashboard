export const AUTH_ENDPOINTS = {
  LOGIN:               '/auth/login',
  REGISTER:            '/auth/register',
  ME:                  '/auth/me',
  LOGOUT:              '/auth/logout',
  LOGOUT_ALL:          '/auth/logout-all',
  REFRESH_TOKEN:       '/auth/refresh-token',
  VERIFY_EMAIL:        (token) => `/auth/verify-email/${encodeURIComponent(token)}`,
  RESEND_VERIFICATION: '/auth/resend-verification',
  FORGOT_PASSWORD:     '/auth/forgot-password',
  RESET_PASSWORD:      (token) => `/auth/reset-password/${token}`,
}
