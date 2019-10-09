import React from 'react'

import {setFilter} from '../../redux/reducers/filterReducer'

const Filter = ({store}) => {
    const handleChange = (event) => {
        const filter = event.target.value
        store.dispatch(setFilter({filter}))
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
        filter <input onChange={handleChange}  />
        </div>
    )
}

export default Filter