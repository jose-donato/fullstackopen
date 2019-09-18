import React from 'react'

const Countries = ({ people, personFilter }) => {
    const peopleToShow = people.filter(person => (
        person.name.includes(personFilter)
    ))

    const rows = () => peopleToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)

    return (
        rows()
    )
}

export default Countries