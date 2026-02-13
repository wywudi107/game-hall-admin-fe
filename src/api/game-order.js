import request from '@/utils/request'

export function getDepositOrders(params) {
  return request.get('/admin/orders/deposit', { params })
}

export function getGameWithdrawOrders(params) {
  return request.get('/admin/orders/withdraw-game', { params })
}
