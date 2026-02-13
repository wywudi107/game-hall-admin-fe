import request from '@/utils/request'

export function getGames(params) {
  return request.get('/admin/games', { params })
}

export function updateGame(id, data) {
  return request.put(`/admin/games/${id}`, data)
}

export function toggleGameStatus(id, data) {
  return request.put(`/admin/games/${id}/status`, data)
}
