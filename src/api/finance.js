import request from '@/utils/request'

export function getDailyReport(params) {
  return request.get('/admin/finance/daily-report', { params })
}

export function generateDailyReport(report_date) {
  return request.post('/admin/finance/daily-report/generate', { report_date })
}

export function getRetentionReport(params) {
  return request.get('/admin/finance/retention', { params })
}

export function refreshRetention() {
  return request.post('/admin/finance/retention/refresh')
}
