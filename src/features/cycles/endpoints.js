export const CYCLES_ENDPOINTS = {
  LIST:           '/cycles',
  CREATE:         '/cycles',
  GET:            (id) => `/cycles/${id}`,
  UPDATE:         (id) => `/cycles/${id}`,
  DELETE:         (id) => `/cycles/${id}`,
  START:          (id) => `/cycles/${id}/start`,
  PAUSE:          (id) => `/cycles/${id}/pause`,
  RESUME:         (id) => `/cycles/${id}/resume`,
  CANCEL_REQUEST: (id) => `/cycles/${id}/cancel-request`,
  CANCEL:         (id) => `/cycles/${id}/cancel`,
  REJECT_CANCEL:  (id) => `/cycles/${id}/reject-cancel`,
  COMPLETE:       (id) => `/cycles/${id}/complete`,
}
