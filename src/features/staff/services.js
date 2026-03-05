import api from '../../lib/axios'
import { STAFF_ENDPOINTS } from './endpoints'

export const uploadStaffImageService = (file) => {
  const fd = new FormData()
  fd.append('image', file)
  return api.post('/upload/image?folder=staff', fd).then((r) => r.data)
}

export const listStaffService      = (params) =>
  api.get(STAFF_ENDPOINTS.LIST, { params }).then((r) => r.data)

export const createStaffService    = (body) =>
  api.post(STAFF_ENDPOINTS.CREATE, body).then((r) => r.data)

export const getStaffMemberService = (id) =>
  api.get(STAFF_ENDPOINTS.GET(id)).then((r) => r.data)

export const updateStaffService    = ({ id, ...body }) =>
  api.patch(STAFF_ENDPOINTS.UPDATE(id), body).then((r) => r.data)

export const deleteStaffService    = (id) =>
  api.delete(STAFF_ENDPOINTS.DELETE(id)).then((r) => r.data)
