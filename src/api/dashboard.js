import request from '@/utils/request'

export function getStats() {
  return request.get('/admin/dashboard/stats')
}

export function getTrend(params) {
  return request.get('/admin/dashboard/trend', { params })
}
