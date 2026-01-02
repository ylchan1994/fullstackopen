const baseUrl = `http://localhost:3001/anecdotes`

const getId = () => (100000 * Math.random()).toFixed(0)

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error(`Failed to get anecdotes from server`)
  }

  return response.json()
}

const getAnecdote = async id => {
  const response = await fetch(`${baseUrl}/${id}`)

  if (!response.ok) {
    throw new Error(`Anecdotes does not exist`)
  }

  return await response.json()
}

const addNewAnecdote = async (anecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: anecdote, id: getId(), votes: 0 })
  })
  if (!response.ok) {
    console.log(response)
    throw new Error(`Failed to add anecdotes to server`)
  }

  return await response.json()
}

const amendAnecdote = async (id) => {
  let body = await getAnecdote(id)
  body.votes = body.votes + 1
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Failed to vote anecdote`)
  }

  return await response.json()
}

export default { getAll, addNewAnecdote, amendAnecdote }