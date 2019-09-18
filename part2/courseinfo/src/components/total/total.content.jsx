import React from 'react'




const Total = ({ parts }) => {

    let numOr0 = n => isNaN(n) ? 0 : n

    const total = () => {
        const p = parts.reduce((partial_sum, a) => {
            return partial_sum + numOr0(a.exercises)
        }, 0)
        return p
    }

    return (
        <div>
            <strong>total of {total()} exercises</strong>
        </div>
    )
}

export default Total