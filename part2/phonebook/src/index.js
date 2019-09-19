import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Filter from './components/filter/filter.component';
import PersonForm from './components/person-form/person-form.component';
import People from './components/people/people.component';
import Notification from './components/notification/notification.component'

import phonebookService from './services/phonebook'

const App = () => {
    const [people, setPeople] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [personFilter, setPersonFilter] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)


    useEffect(() => {
        phonebookService
            .getAll()
            .then(initialPeople => {
                setPeople(initialPeople)
            })
    }, [])


    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setPersonFilter(event.target.value)
    }
    const addPerson = (event) => {
        event.preventDefault()
        let exists = people.filter(person => person.name === newName)

        if (exists.length > 0) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const personToChange = people.find(n => n.id === exists[0].id)
                const changedPerson = { ...personToChange, number: newNumber }
                phonebookService
                    .update(personToChange.id, changedPerson)
                    .then(returnedPerson => {
                        setPeople(people.map(person => person.id !== personToChange.id ? person : returnedPerson))
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        setErrorMessage(
                            `Information of ${personToChange.name} has already been removed from server`
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000)
                        setPeople(people.filter(n => n.id !== personToChange.id))
                    })

            }
            setNewName('')
            setNewNumber('')
        }
        else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            phonebookService
                .create(personObject)
                .then(returnedPerson => {
                    setPeople(people.concat(returnedPerson))
                    setSuccessMessage(
                        `Added ${newName}`
                    )
                    setTimeout(() => {
                        setSuccessMessage(null)
                    }, 5000)
                    setNewName('')
                    setNewNumber('')
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={successMessage} type={'success'} />
            <Notification message={errorMessage} type={'error'} />
            <Filter personFilter={personFilter} handleFilterChange={handleFilterChange} />
            <h3>add a new</h3>
            <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
            <h3>Numbers</h3>
            <People setPeople={setPeople} people={people} personFilter={personFilter} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
