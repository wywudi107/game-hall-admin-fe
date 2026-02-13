import request from '@/utils/request'

export function getWithdrawOrders(params) {
  return request.get('/admin/withdraw/orders', { params })
}

export function getWithdrawOrderDetail(orderId) {
  return request.get(`/admin/withdraw/orders/${orderId}`)
}

export function approveWithdraw(orderId) {
  return request.post(`/admin/withdraw/approve/${orderId}`)
}

export function rejectWithdraw(orderId, data) {
  return request.post(`/admin/withdraw/reject/${orderId}`, data)
}
