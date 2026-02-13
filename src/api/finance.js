import request from '@/utils/request'

export function getDailyReport(params) {
  return request.get('/admin/finance/daily-report', { params })
}

export function getRetentionReport(params) {
  return request.get('/admin/finance/retention', { params })
}

export function refreshRetention() {
  return request.post('/admin/finance/retention/refresh')
}
