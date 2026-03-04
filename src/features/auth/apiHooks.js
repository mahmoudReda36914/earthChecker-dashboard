import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  loginService,
  registerService,
  meService,
  logoutService,
  logoutAllService,
  forgotPasswordService,
  resetPasswordService,
  resendVerificationService,
} from './services'

/* ─────────────────────────────────────────────
   useMe — global auth state query
   ───────────────────────────────────────────── */
export function useMe() {
  const hasToken = Boolean(localStorage.getItem('accessToken'))
  return useQuery({
    queryKey: ['me'],
    queryFn:  meService,
    enabled:  hasToken,
    select:   (data) => data?.data?.user ?? null,
    retry:    false, // don't retry on 401 — interceptor handles the refresh
  })
}

/* ─────────────────────────────────────────────
   useLogin
   ───────────────────────────────────────────── */
export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      const accessToken = data?.data?.accessToken
      if (accessToken) localStorage.setItem('accessToken', accessToken)
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

/* ─────────────────────────────────────────────
   useRegister
   ───────────────────────────────────────────── */
export function useRegister() {
  return useMutation({
    mutationFn: registerService,
  })
}

/* ─────────────────────────────────────────────
   useLogout
   ───────────────────────────────────────────── */
export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logoutService,
    onSettled: () => {
      // Clear regardless of API success/failure
      localStorage.removeItem('accessToken')
      qc.clear()
    },
  })
}

/* ─────────────────────────────────────────────
   useLogoutAll
   ───────────────────────────────────────────── */
export function useLogoutAll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logoutAllService,
    onSettled: () => {
      localStorage.removeItem('accessToken')
      qc.clear()
    },
  })
}

/* ─────────────────────────────────────────────
   useForgotPassword
   ───────────────────────────────────────────── */
export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPasswordService })
}

/* ─────────────────────────────────────────────
   useResetPassword
   ───────────────────────────────────────────── */
export function useResetPassword() {
  return useMutation({ mutationFn: resetPasswordService })
}

/* ─────────────────────────────────────────────
   useResendVerification
   ───────────────────────────────────────────── */
export function useResendVerification() {
  return useMutation({ mutationFn: resendVerificationService })
}
