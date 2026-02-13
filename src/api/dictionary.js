import request from '@/utils/request'

export function getDictionaries(params) {
  return request.get('/admin/dictionaries', { params })
}

export function createDictionary(data) {
  return request.post('/admin/dictionaries', data)
}

export function updateDictionary(id, data) {
  return request.put(`/admin/dictionaries/${id}`, data)
}

export function deleteDictionary(id) {
  return request.delete(`/admin/dictionaries/${id}`)
}
