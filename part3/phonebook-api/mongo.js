const mongoose = require('mongoose')
let getAll = false
if(process.argv.length == 3) {
    getAll = true
}
else if ( process.argv.length<5 ) {
    console.log('usage: node mongo.js <password> <person_name> <person_number>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const mongoString =
  `mongodb+srv://fullstack:${password}@fullstackopen-ghm0k.mongodb.net/people-app?retryWrites=true&w=majority`

mongoose.connect(mongoString, {useUnifiedTopology: true, useNewUrlParser: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name,
    number
})

if(getAll) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}