import api from '../../lib/axios'
import { FORMS_ENDPOINTS } from './endpoints'

/** GET /api/forms — paginated + filtered */
export const listFormsService = (params) =>
  api.get(FORMS_ENDPOINTS.LIST, { params }).then((r) => r.data)

/** POST /api/forms */
export const createFormService = (body) =>
  api.post(FORMS_ENDPOINTS.CREATE, body).then((r) => r.data)

/** GET /api/forms/:id */
export const getFormService = (id) =>
  api.get(FORMS_ENDPOINTS.GET(id)).then((r) => r.data)

/** PATCH /api/forms/:id */
export const updateFormService = ({ id, ...body }) =>
  api.patch(FORMS_ENDPOINTS.UPDATE(id), body).then((r) => r.data)

/** DELETE /api/forms/:id  (soft delete) */
export const deleteFormService = (id) =>
  api.delete(FORMS_ENDPOINTS.DELETE(id)).then((r) => r.data)

/** PATCH /api/forms/reorder */
export const reorderFormsService = (body) =>
  api.patch(FORMS_ENDPOINTS.REORDER, body).then((r) => r.data)
