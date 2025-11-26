import { useState } from 'react'
import phoneBookServices from './services/phone-book'
import { useEffect } from 'react'

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with
      <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const PersonForm = ({
  name,
  number,
  onSubmit,
  onNameChange,
  onNumberChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={number}
          onChange={onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    persons.map(person =>
      <div key={person.id}>
        {person.name} {person.number}
        <button id={person.id} type='submit' onClick={onDelete} value={person.name}>Delete</button>
      </div>
    )
  )
}

const successStyle = {
  color: 'green',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  borderColor: 'green',
  padding: '10px',
  marginBottom: '10px'
}

const errorStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  borderColor: 'red',
  padding: '10px',
  marginBottom: '10px'
}

const App = () => {

  useEffect(() => {
    phoneBookServices
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [floatingMessage, setFloatingMessage] = useState({
    message: '',
    style: '',
  })

  const filteredList = persons?.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const checkDuplicate = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (checkDuplicate) {
      checkDuplicate.number = newNumber
      const confirmation = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!confirmation) return

      phoneBookServices
        .updatePhone(checkDuplicate.id, checkDuplicate)
        .then(() => {
          setPersons(persons.map(person => person.id === checkDuplicate.id ? checkDuplicate : person))
          setFloatingMessage({ message: `Updated ${newName}`, style: successStyle })
          setTimeout(() => {
            setFloatingMessage({ message: '', style: '', })
          }, 5000)
        })
        .catch(error => {
          if (error.response.status == 404) {
            setFloatingMessage({ message: `Information of ${newName} has already been removed from server`, style: errorStyle })
            setTimeout(() => {
              setFloatingMessage({ message: '', style: '', })
            }, 5000)
          }
        })

      return
    }

    phoneBookServices
      .create({ name: newName, number: newNumber })
      .then(() => {
        setPersons([...persons, { name: newName, number: newNumber }])
        setFloatingMessage({ message: `Added ${newName}`, style: successStyle })
        setTimeout(() => {
          setFloatingMessage({ message: '', style: '', })
        }, 5000)
      })
  }

  const handleDelete = (e) => {
    e.preventDefault()
    const name = e.target.value
    const confirmation = window.confirm(`Delete ${name}?`)
    if (!confirmation) return
    const id = e.target.id
    phoneBookServices
      .del(id)
      .then(() => setPersons(persons.filter(person => person.id !== id)))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {floatingMessage.message ? <p style={floatingMessage.style}>{floatingMessage.message}</p> : ''}
      <Filter value={filter} onChange={handleFilterChange}></Filter>
      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onSubmit={handleSubmit}
        onNumberChange={handleNumberChange}
        onNameChange={handleNameChange}>
      </PersonForm>
      <h3>Numbers</h3>
      <Persons persons={filteredList} onDelete={handleDelete}></Persons>
    </div>
  )
}

export default App