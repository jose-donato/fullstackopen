const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    born: {
        type: Number,
    },
    bookCount: {
        type: Number,
        default: 1
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    }]
})

module.exports = mongoose.model('Author', schema)