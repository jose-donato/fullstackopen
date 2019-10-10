import React from 'react'
import {connect} from 'react-redux'
import {setFilter} from '../../redux/reducers/filterReducer'

const Filter = ({setFilter}) => {
    const handleChange = (event) => {
        const filter = event.target.value
        setFilter({filter})
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
const mapDispatchToProps = {
    setFilter,
}

export default connect(
    null,
    mapDispatchToProps
)(Filter)
