import request from '@/utils/request'

export function getRechargeOrders(params) {
  return request.get('/admin/recharge/orders', { params })
}

export function getRechargeOrderDetail(orderId) {
  return request.get(`/admin/recharge/orders/${orderId}`)
}

export function manualRecharge(data) {
  return request.post('/admin/recharge/manual', data)
}

export function cancelRechargeOrder(orderId, remark) {
  return request.put(`/admin/recharge/cancel/${orderId}`, { remark })
}
