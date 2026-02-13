import request from '@/utils/request'

export function getUsers(params) {
  return request.get('/admin/users', { params })
}

export function getUserDetail(id) {
  return request.get(`/admin/users/${id}`)
}

export function updateUserStatus(id, data) {
  return request.put(`/admin/users/${id}/status`, data)
}

export function updateUserVip(id, data) {
  return request.put(`/admin/users/${id}/vip`, data)
}

export function adjustBalance(id, data) {
  return request.put(`/admin/users/${id}/balance`, data)
}

export function resetPassword(id, data) {
  return request.put(`/admin/users/${id}/password`, data)
}
