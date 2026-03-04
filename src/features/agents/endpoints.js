export const AGENTS_ENDPOINTS = {
  LIST:    '/agents',
  CREATE:  '/agents',
  GET:     (id) => `/agents/${id}`,
  UPDATE:  (id) => `/agents/${id}`,
  DELETE:  (id) => `/agents/${id}`,
  LIKE:    (id) => `/agents/${id}/like`,
  DISLIKE: (id) => `/agents/${id}/dislike`,
}
