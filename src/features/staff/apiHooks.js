import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listStaffService,
  createStaffService,
  getStaffMemberService,
  updateStaffService,
  deleteStaffService,
} from './services'

const KEY = 'staff'

export function useStaff(params = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn:  () => listStaffService(params),
    select:   (data) => data?.data,  // { staff, pagination }
  })
}

export function useStaffMember(id) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn:  () => getStaffMemberService(id),
    enabled:  !!id,
    select:   (data) => data?.data?.staff,
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createStaffService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateStaffService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useDeleteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteStaffService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
