import api from '../../lib/axios'
import { CYCLES_ENDPOINTS } from './endpoints'

export const listCyclesService      = (params) =>
  api.get(CYCLES_ENDPOINTS.LIST, { params }).then((r) => r.data)

export const createCycleService     = (body)  =>
  api.post(CYCLES_ENDPOINTS.CREATE, body).then((r) => r.data)

export const getCycleService        = (id)    =>
  api.get(CYCLES_ENDPOINTS.GET(id)).then((r) => r.data)

export const updateCycleService     = ({ id, ...body }) =>
  api.patch(CYCLES_ENDPOINTS.UPDATE(id), body).then((r) => r.data)

export const deleteCycleService     = (id)    =>
  api.delete(CYCLES_ENDPOINTS.DELETE(id)).then((r) => r.data)

export const startCycleService      = (id)    =>
  api.patch(CYCLES_ENDPOINTS.START(id)).then((r) => r.data)

export const pauseCycleService      = ({ id, message }) =>
  api.patch(CYCLES_ENDPOINTS.PAUSE(id), { message }).then((r) => r.data)

export const resumeCycleService     = (id)    =>
  api.patch(CYCLES_ENDPOINTS.RESUME(id)).then((r) => r.data)

export const cancelRequestService   = ({ id, message }) =>
  api.patch(CYCLES_ENDPOINTS.CANCEL_REQUEST(id), { message }).then((r) => r.data)

export const cancelCycleService     = (id)    =>
  api.patch(CYCLES_ENDPOINTS.CANCEL(id)).then((r) => r.data)

export const rejectCancelService    = (id)    =>
  api.patch(CYCLES_ENDPOINTS.REJECT_CANCEL(id)).then((r) => r.data)

export const completeCycleService   = (id)    =>
  api.patch(CYCLES_ENDPOINTS.COMPLETE(id)).then((r) => r.data)
