import React, {useState} from 'react'
import Country from '../country/country.component'

const Countries = ({ countries, countryFilter }) => {
    const [showArray, setShowArray] = useState([])
    const countriesToShow = countries.filter(country => (
        country.name.includes(countryFilter)
    ))

    function handleButtonClicked(name) {
        if(showArray.includes(name)) {
            const newArray = showArray.filter(item => item !== name)
            setShowArray(newArray)
        } else {
            setShowArray(showArray.concat(name))
        }
    }

    const rows = () => {
        if(countriesToShow.length > 10) return <p>Too many matches, specify another filter</p>
        else {
            if(countriesToShow.length === 1) return <Country name={countriesToShow[0].name}/>
            else return countriesToShow.map(country => 
                <div key={country.name}>
                    <p>{country.name}</p>
                    <button onClick={() => handleButtonClicked(country.name)}>show</button>
                    {showArray.includes(country.name) ? <Country name={country.name}/> : null
                    }
                </div>
            )
        }
        
    }

    return (
        rows()
    )
}

export default Countries