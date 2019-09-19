import React, { useEffect, useState } from 'react'
import axios from 'axios'
const key = '106f9cff370ffe8bfcfefb38a9549759'
const Country = ({ name }) => {
    const [info, setInfo] = useState({ country: '' })
    const [weather, setWeather] = useState({ weather: '' })
    useEffect(() => {
        axios
            .get(`https://restcountries.eu/rest/v2/name/${name}`)
            .then(response => {
                const responseObj = response.data[0]
                setInfo(responseObj)
                axios
                    .get(`http://api.weatherstack.com/current?access_key=${key}&query=${response.data[0].capital}`)
                    .then(weatherResponse => {
                        const responseWeatherObj = weatherResponse.data
                        setWeather(responseWeatherObj)

                    })
            })
    }, [name])


    return (
        <div>
            <h1>{name}</h1>
            <p>capital {info.capital}</p>
            <p>population {info.population}</p>
            <h2><strong>languages</strong></h2>
            {info.languages ?
                <ul>{info.languages.map(language => <li key={language.name}>{language.name}</li>)}</ul> : null}
            <img width='300px' src={info.flag} alt="country_img" />
            {weather.current ?
                <div>
                    <h2>Weather in {info.capital}</h2>
                    <p><strong>temperature:</strong> {weather.current.temperature} ºC</p>
                    <img width='50px' src={weather.current.weather_icons[0]} alt="capital_weather" />
                    <p><strong>wind:</strong> {weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
                </div>
                : null}

        </div>

    )
}

export default Country