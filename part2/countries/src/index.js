import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Filter from './components/filter/filter.component';
import Countries from './components/countries/countries.component';
import axios from 'axios'

const App = () => {
    const [countries, setCountries] = useState([])
    const [countryFilter, setCountryFilter] = useState('')

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])


    const handleFilterChange = (event) => {
        setCountryFilter(event.target.value)
    }


    return (
        <div>
            <Filter countryFilter={countryFilter} handleFilterChange={handleFilterChange} />
            <Countries countries={countries} countryFilter={countryFilter} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
