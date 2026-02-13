import request from '@/utils/request'

// 管理员
export function getAdmins(params) {
  return request.get('/admin/admins', { params })
}

export function createAdmin(data) {
  return request.post('/admin/admins', data)
}

export function updateAdmin(id, data) {
  return request.put(`/admin/admins/${id}`, data)
}

export function deleteAdmin(id) {
  return request.delete(`/admin/admins/${id}`)
}

// 角色
export function getRoles() {
  return request.get('/admin/roles')
}

export function createRole(data) {
  return request.post('/admin/roles', data)
}

export function updateRole(id, data) {
  return request.put(`/admin/roles/${id}`, data)
}

export function deleteRole(id) {
  return request.delete(`/admin/roles/${id}`)
}

// 操作日志
export function getOperationLogs(params) {
  return request.get('/admin/operation-logs', { params })
}
