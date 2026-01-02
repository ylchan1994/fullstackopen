import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAllAnecdotes, voteAnecdote } from './request'
import NotificationContext from './notificationContext'
import { useContext } from 'react'

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdote'] })
    }
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
    notificationDispatch(`You have voted "${anecdote.content}"`)
  }

  let anecdotes = []

  const result = useQuery({
    queryKey: ['anecdote'],
    queryFn: getAllAnecdotes,
    refetchOnWindowFocus: false
  })

  //console.log(JSON.parse(JSON.stringify(result)))
  anecdotes = result.data

  if (result.isLoading) { return <div>loading data...</div> }
  if (result.isError) { return <div>anecdote service not available due to problems in server</div> }

  const notes = result.data
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
