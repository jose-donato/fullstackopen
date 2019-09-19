import React from 'react'
import phonebookService from '../../services/phonebook'

const People = ({ setPeople, people, personFilter }) => {
    const peopleToShow = people.filter(person => (
        person.name.includes(personFilter)
    ))

    const rows = () => peopleToShow.map(person =>
        <div key={person.id}>
            <p>{person.name} {person.number}</p>
            <button onClick={() => {
                if (window.confirm(`delete ${person.name}?`)) {
                    phonebookService
                        .deletePerson(person.id)
                        .then(response => {
                            setPeople(people.filter(item => item.id !== person.id))
                        })
                }
            }}>delete</button>
        </div>
    )
    return (
        rows()
    )
}

export default People