import { useDispatch, useSelector } from 'react-redux'
import { initialisedAnecdote, voteAnecdote } from '../reducers/anecdoteReducer'
import { useEffect } from 'react'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const state = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()
  const filteredAnecdotes = state.filter(anecdote => anecdote.content.match(RegExp(filter, 'i')))

  const vote = id => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`You voted for ${state.find(a => a.id === id).content}`, 5))
  }

  useEffect(() => {
    console.log('useEffect is run')
    dispatch(initialisedAnecdote())
  }, [dispatch])

  return (
    filteredAnecdotes.map(anecdote => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    ))
  )
}

export default AnecdoteList
