const Country = ({ country }) => {
  if (!country) return
  return (
    <>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {country.languages?.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flag}></img>
    </>
  )
}

const CountryList = ({ countryList, onClick }) => {
  return (
    <>
      {countryList.map(country => {
        return (
          <div key={country}>
            {country}
            <button value={country} onClick={onClick}>Show</button>
          </div>
        )
      })}
    </>
  )
}

export { CountryList, Country }