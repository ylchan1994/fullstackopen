import AnecdoteForm from './components/anecdote-form'
import AnecdoteList from './components/anecdote-list'
import Filter from './components/filter'
import Notification from './components/Notification'
import { useSelector } from 'react-redux'

const App = () => {
  const notification = useSelector(state => state.notification)

  return (
    <div>
      <h2>Anecdotes</h2>
      {notification && <Notification />}
      <Filter />
      <AnecdoteList />
      <AnecdoteForm></AnecdoteForm>
    </div>
  )
}

export default App
