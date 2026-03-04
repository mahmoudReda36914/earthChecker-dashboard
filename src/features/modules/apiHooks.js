import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listModulesService,
  createModuleService,
  getModuleService,
  updateModuleService,
  deleteModuleService,
} from './services'

const KEY = 'modules'

/* ── List (paginated + filtered) ── */
export function useModules(params = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn:  () => listModulesService(params),
    select:   (data) => data?.data,   // { modules, pagination }
  })
}

/* ── Single ── */
export function useModule(id) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn:  () => getModuleService(id),
    enabled:  !!id,
    select:   (data) => data?.data?.module,
  })
}

/* ── Create ── */
export function useCreateModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createModuleService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

/* ── Update ── */
export function useUpdateModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateModuleService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

/* ── Delete (soft) ── */
export function useDeleteModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteModuleService,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
