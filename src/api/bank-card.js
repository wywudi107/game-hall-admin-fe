import request from '@/utils/request'

export function getBankCards(params) {
  return request.get('/admin/bank-cards', { params })
}

export function deleteBankCard(id) {
  return request.delete(`/admin/bank-cards/${id}`)
}
