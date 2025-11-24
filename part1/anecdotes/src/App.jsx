import { useState } from 'react'

const Button = ({ name, onClick }) => {
  return (
    <>
      <button type='submit' onClick={onClick}>{name}</button>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  })
  const [indexWithMostVote, setIndexWithMostVote] = useState(0)

  const handleClick = () => {
    let randomIndex = Math.round(Math.random() * (anecdotes.length - 1))
    while (randomIndex === selected) {
      randomIndex = Math.round(Math.random() * (anecdotes.length - 1))
    }
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const newVote = vote[selected] + 1
    setVote({
      ...vote,
      [selected]: newVote
    })

    if (newVote > vote[indexWithMostVote]) setIndexWithMostVote(selected)
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>has {vote[selected]} votes</p>
        <Button name='vote' onClick={handleVote}></Button>
        <Button name='next anecdote' onClick={handleClick}></Button>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[indexWithMostVote]}</p>
        <p>has {vote[indexWithMostVote]} votes</p>
      </div>
    </>
  )
}

export default App