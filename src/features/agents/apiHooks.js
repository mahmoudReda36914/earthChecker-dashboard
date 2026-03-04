import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listAgentsService, createAgentService, getAgentService,
  updateAgentService, deleteAgentService, likeAgentService, dislikeAgentService,
} from './services'

const KEY = 'agents'

export function useAgents(params = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn:  () => listAgentsService(params),
    select:   (d) => d?.data,   // { agents, pagination }
  })
}

export function useAgent(id) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn:  () => getAgentService(id),
    enabled:  !!id,
    select:   (d) => d?.data?.agent,
  })
}

export function useCreateAgent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createAgentService, onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}

export function useUpdateAgent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: updateAgentService, onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}

export function useDeleteAgent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteAgentService, onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}

export function useLikeAgent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: likeAgentService, onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}

export function useDislikeAgent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: dislikeAgentService, onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }) })
}
