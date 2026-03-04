import api from '../../lib/axios'
import { AUTH_ENDPOINTS } from './endpoints'

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} credentials
 */
export const loginService = (credentials) =>
  api.post(AUTH_ENDPOINTS.LOGIN, credentials).then((r) => r.data)

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string, company: object }} payload
 */
export const registerService = (payload) =>
  api.post(AUTH_ENDPOINTS.REGISTER, payload).then((r) => r.data)

/**
 * GET /api/auth/me  — requires valid access token
 */
export const meService = () =>
  api.get(AUTH_ENDPOINTS.ME).then((r) => r.data)

/**
 * POST /api/auth/logout
 */
export const logoutService = () =>
  api.post(AUTH_ENDPOINTS.LOGOUT).then((r) => r.data)

/**
 * POST /api/auth/logout-all  — requires valid access token
 */
export const logoutAllService = () =>
  api.post(AUTH_ENDPOINTS.LOGOUT_ALL).then((r) => r.data)

/**
 * POST /api/auth/forgot-password
 * @param {{ email: string }} payload
 */
export const forgotPasswordService = (payload) =>
  api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload).then((r) => r.data)

/**
 * POST /api/auth/reset-password/:token
 * @param {{ token: string, password: string }} payload
 */
export const resetPasswordService = ({ token, password }) =>
  api.post(AUTH_ENDPOINTS.RESET_PASSWORD(token), { password }).then((r) => r.data)

/**
 * POST /api/auth/resend-verification
 * @param {{ email: string }} payload
 */
export const resendVerificationService = (payload) =>
  api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, payload).then((r) => r.data)
