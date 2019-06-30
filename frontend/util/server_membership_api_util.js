export const postServerMembership = serverId => {
  return $.ajax({
    method: 'POST',
    url: '/api/server_memberships',
    data: { server_id: serverId }
  })
}

export const deleteServerMembership = id => {
  return $.ajax({
    method: 'DELETE',
    url: `/api/server_memberships/${id}`
  })
}

export const patchServerMembership = (id, nickname) => {
  return $.ajax({
    method: 'PATCH',
    url: `/api/server_memberships/${id}`,
    data: { nickname }
  })
}