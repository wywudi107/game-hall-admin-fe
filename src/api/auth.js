import request from '@/utils/request'

export function getCaptcha() {
  return request.get('/admin/captcha')
}

export function login(data) {
  return request.post('/admin/login', data)
}

export function logout() {
  return request.post('/admin/logout')
}

export function getProfile() {
  return request.get('/admin/profile')
}

export function changePassword(data) {
  return request.put('/admin/password', data)
}
