const STORAGE_KEY = 'resume_data'

export function saveUserResume(userId, markdown) {
  const data = getAllResumes()
  data[userId] = {
    markdown,
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getUserResume(userId) {
  const data = getAllResumes()
  return data[userId]?.markdown || null
}

export function getAllResumes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function deleteUserResume(userId) {
  const data = getAllResumes()
  delete data[userId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function exportResume(userId) {
  const markdown = getUserResume(userId)
  if (!markdown) return null
  return markdown
}
