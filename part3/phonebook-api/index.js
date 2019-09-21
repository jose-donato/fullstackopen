require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

var morgan = require('morgan')

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :http-version - :response-time[3] ms :body'))


app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(`<p>Phonebook has info for ${people.length} people</p><p>${(new Date()).toUTCString()}</p>`)
  })
})

app.get('/api/people', (req, res) => {
  Person.find({}).then(people => {
    res.json(people.map(person => person.toJSON()))
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

app.get('/api/people/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(error => {
    //next(error)
    return res.status(400).json({ 
      error 
    })
  })
})

app.delete('/api/people/:id', (req, res, next) => {
  const id = req.params.id
  Person.findOneAndDelete(id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => {
    //next(error)
    return res.status(400).json({ 
      error 
    })
  })
})

app.put('/api/people/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findOneAndUpdate(id, person)
  .then(updatedPerson => {
    res.json(updatedPerson.toJSON())
  })
  .catch(error => {
    //next(error)
    return res.status(400).json({ 
      error 
    })
  })
})

app.post('/api/people', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  Person.find({name: body.name}).then(people => {
    if(people.length > 0) {
      return res.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  })
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => {
      //next(error)
      return res.status(400).json({ 
        error 
      })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})