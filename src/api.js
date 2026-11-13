export async function readApiResponse(response, fallbackMessage = 'Request failed') {
  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      if (!response.ok) {
        throw new Error(text || fallbackMessage)
      }
      throw new Error('Backend returned an invalid JSON response.')
    }
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || text || fallbackMessage)
  }

  if (!data) {
    throw new Error('Backend returned an empty response.')
  }

  return data
}
