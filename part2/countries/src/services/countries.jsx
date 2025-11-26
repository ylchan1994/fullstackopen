import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAllCountriesName = () => {
  const request = axios.get(`${baseUrl}/api/all`)
  return request.then(response => response.data.map(country => country.name.common))
}

const getSpecificCountryDetails = name => {
  const request = axios.get(`${baseUrl}/api/name/${name}`)
  return request.then(response => response.data)
}

export default { 
  getSpecificCountryDetails, 
  getAllCountriesName,
}