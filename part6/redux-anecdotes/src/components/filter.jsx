import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'
import { updateNotification } from '../reducers/notificationReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (e) => {
    // input-field value is in variable event.target.value
    e.preventDefault()
    const filter = e.target.value
    dispatch(filterChange(filter))
    dispatch(updateNotification(`You filter "${filter}"`))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter