const API_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 401) {
    const err = new Error('not_logged_in')
    err.code = 401
    throw err
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.error) message = body.error
    } catch {
      // ignore, use default message
    }
    const err = new Error(message)
    err.code = res.status
    throw err
  }
  return res.json()
}

export const api = {
  loginUrl: () => `${API_URL}/auth/login`,
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/api/me'),
  guilds: () => request('/api/guilds'),
  getConfig: (guildId) => request(`/api/guilds/${guildId}/config`),
  patchConfig: (guildId, updates) =>
    request(`/api/guilds/${guildId}/config`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  roles: (guildId) => request(`/api/guilds/${guildId}/roles`),
  channels: (guildId) => request(`/api/guilds/${guildId}/channels`),
  autoConfigureRole: (guildId) =>
    request(`/api/guilds/${guildId}/auto-configure-role`, { method: 'POST' }),
  postTrapNotice: (guildId) =>
    request(`/api/guilds/${guildId}/trap-notice`, { method: 'POST' }),
  inviteUrl: (guildId) =>
    request(guildId ? `/api/invite-url?guild_id=${guildId}` : '/api/invite-url'),
}
