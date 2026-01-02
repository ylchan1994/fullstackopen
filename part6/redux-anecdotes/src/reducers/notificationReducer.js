import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    updateNotification(_state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      if (action.payload !== state) return state
      return null
    }
  }
})

const { clearNotification } = notificationSlice.actions

export const setNotification = (message, timeOut) => {
  return async dispatch => {
    dispatch(updateNotification(message))
    setTimeout(() => dispatch(clearNotification(message)), timeOut * 1000)
  }
}

export const { updateNotification } = notificationSlice.actions
export default notificationSlice.reducer
