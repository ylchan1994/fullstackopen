import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes.js'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const sortAnecdotes = (anecdotes) => anecdotes.sort((a, b) => b.votes - a.votes)

const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push(content)
    },
    vote(state, action) {
      const id = action.payload
      state.forEach(anecdote => anecdote.id === id ? anecdote.votes++ : '')
      return sortAnecdotes(state)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  },

})

const { setAnecdote, createAnecdote, vote } = anecdoteReducer.actions

export const initialisedAnecdote = () => {
  return async (dispatch) => {
    const initialAnecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(initialAnecdotes))
  }
}

export const newAnecdote = (anecdote) => {
  return async (dispatch) => {
    const addnewanecdote = await anecdoteService.addNewAnecdote(anecdote)
    dispatch(createAnecdote(addnewanecdote))
  }
}

export const voteAnecdote = id => {
  return async (dispatch) => {
    const amendAnecdote = await anecdoteService.amendAnecdote(id)
    dispatch(vote(amendAnecdote.id))
  }
}

export default anecdoteReducer.reducer
