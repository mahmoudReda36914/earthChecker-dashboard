import api from '../../lib/axios'
import { AGENTS_ENDPOINTS } from './endpoints'

export const listAgentsService   = (params) =>
  api.get(AGENTS_ENDPOINTS.LIST, { params }).then((r) => r.data)

export const createAgentService  = (formData) =>
  api.post(AGENTS_ENDPOINTS.CREATE, formData).then((r) => r.data)

export const getAgentService     = (id) =>
  api.get(AGENTS_ENDPOINTS.GET(id)).then((r) => r.data)

export const updateAgentService  = ({ id, formData }) =>
  api.patch(AGENTS_ENDPOINTS.UPDATE(id), formData).then((r) => r.data)

export const deleteAgentService  = (id) =>
  api.delete(AGENTS_ENDPOINTS.DELETE(id)).then((r) => r.data)

export const likeAgentService    = (id) =>
  api.patch(AGENTS_ENDPOINTS.LIKE(id)).then((r) => r.data)

export const dislikeAgentService = (id) =>
  api.patch(AGENTS_ENDPOINTS.DISLIKE(id)).then((r) => r.data)
