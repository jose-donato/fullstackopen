import React from 'react'

const Filter = ({ personFilter, handleFilterChange }) => (
    <div>
        filter shown with: <input value={personFilter} onChange={handleFilterChange} />
    </div>
)

export default Filter