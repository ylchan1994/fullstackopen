import { useState } from 'react';
import { useEffect } from 'react';
import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  return action
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [timeoutId, setTimeoutId] = useState(null)
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  useEffect(() => {
    clearTimeout(timeoutId)
    if (!notification) return
    setTimeoutId(setTimeout(() => notificationDispatch(null), 5000))
  }, [notification])

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext