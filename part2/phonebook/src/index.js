import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Filter from './components/filter/filter.component';
import PersonForm from './components/person-form/person-form.component';
import People from './components/people/people.component';
import axios from 'axios'

const App = () => {
    const [people, setPeople] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [personFilter, setPersonFilter] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/people')
            .then(response => {
                setPeople(response.data)
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
            alert(`${newName} is already added to phonebook`)
            setNewName('')
            setNewNumber('')
        }
        else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            setPeople(people.concat(personObject))
            setNewName('')
            setNewNumber('')
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter personFilter={personFilter} handleFilterChange={handleFilterChange} />
            <h3>add a new</h3>
            <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
            <h3>Numbers</h3>
            <People people={people} personFilter={personFilter} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
