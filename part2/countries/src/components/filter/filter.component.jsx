import React from 'react'

const Filter = ({ countryFilter, handleFilterChange }) => (
    <div>
        find countries: <input value={countryFilter} onChange={handleFilterChange} />
    </div>
)

export default Filter