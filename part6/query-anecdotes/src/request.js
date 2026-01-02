const getId = () => (100000 * Math.random()).toFixed(0)
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAllAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

const getAnecdote = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

export const addNewAnecdote = async (anecdote) => {
  const body = {
    content: anecdote,
    id: getId(),
    votes: 0
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}

export const voteAnecdote = async (anecdote) => {
  const body = anecdote
  body.votes = body.votes + 1

  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}