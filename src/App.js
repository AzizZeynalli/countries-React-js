import { useState, useEffect } from 'react'
import axios from 'axios'
import process from 'process'

const api_key = process.env.REACT_APP_API_KEY

const Countries = ({countries, handleClick}) => {


  if(countries.length === 0){
    return null
  } else if(countries.length === 1){
    const countryObject = countries[0]
    return <AdditionalInfo country={countryObject} />
  } else if(countries.length > 1 && countries.length <= 10){
    return (
      <ul>
        {countries.map(country => <li key={country.name.common}>{country.name.common} <button onClick={()=>handleClick(country)}>show</button></li>)}
      </ul>
    )
  } else{
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

const AdditionalInfo = ({country}) => {
  
  const [weather, setWeather] = useState(null)

  useEffect(()=>{
    axios 
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric&appid=${api_key}`)
    .then((response) => {
      setWeather(response.data)
    })
  }, [country])

  const languages = Object.values(country.languages)

  return (
    <div>
      <h2>{country.name.common}</h2>
      capital {country.capital}
      <br/>
      area {country.area}
      <br/><br/>
      <b>languages:</b>
      <ul>
        {languages.map((language) => 
        <li key={language}>{language}</li>)}
      </ul>
      <img alt={country.flags.alt} src={country.flags.png} style={{width:150, height:100}}/>
      {weather && 
      (<div><h3>Weather in {country.capital}</h3>
      temperature {weather.main.temp} Celcius
      <br/>
      wind {weather.wind.speed} m/s
      <br/>
      <img alt="hello" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/></div>)
      }
    </div>
  )
}


const App = () => {

  const [search, setSearch] = useState('')
  const [additional, setAdditional] = useState(null)
  const [countries, setCountries] = useState([])

  const handleClick = (country) => {
    setAdditional(country)
  }

  useEffect(()=>{
    if(additional){
      setCountries([])
    }
  }, [additional])

  useEffect(()=>{
    if(search !== ''){
      axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
        const allCountries = response.data
        setCountries(allCountries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase())))
        setAdditional(null)
      })
    }
  },[search])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      find countries
      <input value={search} onChange={handleSearch}/>
      <Countries countries={countries} handleClick={handleClick}/>
      {additional && <AdditionalInfo country={additional} />}
    </div>
  )
}

export default App