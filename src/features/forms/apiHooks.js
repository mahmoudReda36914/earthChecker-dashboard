import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listFormsService,
  createFormService,
  getFormService,
  updateFormService,
  deleteFormService,
  reorderFormsService,
} from './services'

const KEY = 'forms'

/** List (paginated + filtered by moduleId, search, etc.) */
export function useForms(params = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn:  () => listFormsService(params),
    select:   (data) => data?.data,  // { forms, pagination }
  })
}

/** Infinite list — scroll pagination */
export function useFormsInfinite(params = {}) {
  return useInfiniteQuery({
    queryKey:        [KEY, 'infinite', params],
    queryFn:         ({ pageParam }) => listFormsService({ ...params, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const p = lastPage?.data?.pagination
      return p && p.page < p.pages ? p.page + 1 : undefined
    },
  })
}

/** Single form by id */
export function useForm(id) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn:  () => getFormService(id),
    enabled:  !!id,
    select:   (data) => data?.data?.form,
  })
}

/** Create */
export function useCreateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createFormService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

/** Update */
export function useUpdateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateFormService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

/** Reorder forms within a module */
export function useReorderForms() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reorderFormsService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

/** Delete (soft) */
export function useDeleteForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteFormService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
