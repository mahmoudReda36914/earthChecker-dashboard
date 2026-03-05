import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listCyclesService, createCycleService, getCycleService,
  updateCycleService, deleteCycleService, startCycleService,
  pauseCycleService, resumeCycleService, cancelRequestService,
  cancelCycleService, rejectCancelService, completeCycleService,
} from './services'

const KEY = 'cycles'
const inv = (qc) => qc.invalidateQueries({ queryKey: [KEY] })

export const useCycles      = (params = {}) => useQuery({
  queryKey: [KEY, params],
  queryFn:  () => listCyclesService(params),
  select:   (d) => d?.data,
})

export const useCycle       = (id) => useQuery({
  queryKey: [KEY, id],
  queryFn:  () => getCycleService(id),
  enabled:  !!id,
  select:   (d) => d?.data?.cycle,
})

export const useCreateCycle      = () => { const qc = useQueryClient(); return useMutation({ mutationFn: createCycleService,   onSuccess: () => inv(qc) }) }
export const useUpdateCycle      = () => { const qc = useQueryClient(); return useMutation({ mutationFn: updateCycleService,   onSuccess: () => inv(qc) }) }
export const useDeleteCycle      = () => { const qc = useQueryClient(); return useMutation({ mutationFn: deleteCycleService,   onSuccess: () => inv(qc) }) }
export const useStartCycle       = () => { const qc = useQueryClient(); return useMutation({ mutationFn: startCycleService,    onSuccess: () => inv(qc) }) }
export const usePauseCycle       = () => { const qc = useQueryClient(); return useMutation({ mutationFn: pauseCycleService,    onSuccess: () => inv(qc) }) }
export const useResumeCycle      = () => { const qc = useQueryClient(); return useMutation({ mutationFn: resumeCycleService,   onSuccess: () => inv(qc) }) }
export const useCancelRequest    = () => { const qc = useQueryClient(); return useMutation({ mutationFn: cancelRequestService, onSuccess: () => inv(qc) }) }
export const useCancelCycle      = () => { const qc = useQueryClient(); return useMutation({ mutationFn: cancelCycleService,   onSuccess: () => inv(qc) }) }
export const useRejectCancel     = () => { const qc = useQueryClient(); return useMutation({ mutationFn: rejectCancelService,  onSuccess: () => inv(qc) }) }
export const useCompleteCycle    = () => { const qc = useQueryClient(); return useMutation({ mutationFn: completeCycleService, onSuccess: () => inv(qc) }) }
