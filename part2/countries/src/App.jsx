import { useState } from 'react'
import countriesServices from './services/countries'
import { useEffect } from 'react'
import {CountryList, Country} from './components/country'

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

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountriesList, setFilteredCountriesList] = useState([])
  const [isCountryListDisplay, setIsCountryListDisplay] = useState(false)
  const [isCountryDisplay, setIsCountryDisplay] = useState(false)
  const [isWarning, setIsWarning] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState({})

  useEffect(() => {
    countriesServices
      .getAllCountriesName()
      .then(countries => {
        setCountries(countries)
      })
  }, [])

  useEffect(() => {
    const filteredList = countries?.filter(country => country.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountriesList(filteredList)
    if (!filter) {
      setIsWarning(false)
      setIsCountryDisplay(false)
      setIsCountryListDisplay(false)
      return
    }

    if (filteredList.length > 10) {
      setIsWarning(true)
      setIsCountryListDisplay(false)
      setIsCountryDisplay(false)
    } else {
      setIsWarning(false)
      setIsCountryListDisplay(true)
      setIsCountryDisplay(false)
    }

    if (filteredList.length == 1) {
      getCountry(filteredList[0])        
    }

  }, [filter])

  const getCountry = country => {
    countriesServices
        .getSpecificCountryDetails(country)
        .then(response => {
          setSelectedCountry({
            name: response.name.common,
            capital: response.capital,
            area: response.area,
            languages: Object.values(response.languages),
            flag: response.flags.png
          })
          setIsCountryDisplay(true)
          setIsWarning(false)
          setIsCountryListDisplay(false)
        })
  }

  const handleClick = (e) => {
    e.preventDefault()
    const country = e.target.value
    getCountry(country)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  return (
    <div>
      find countries
      <input onChange={handleFilterChange}></input>
      {isWarning ? <p>Too many matches, specify another filter</p> : ''}
      {isCountryListDisplay ? <CountryList countryList={filteredCountriesList} onClick={handleClick}/> : ""}
      {isCountryDisplay ? <Country country={selectedCountry}/> : ''}
    </div>
  )
}

export default App