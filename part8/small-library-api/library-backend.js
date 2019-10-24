const { ApolloServer, UserInputError, gql, PubSub  } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
        bookCount: 2
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963,
        bookCount: 1
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821,
        bookCount: 2
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
        bookCount: 1
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
        bookCount: 1
    },
]

/*
 * It would be more sensible to assosiate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]


mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const MONGODB_URI = 'mongodb+srv://fullstack:hiGEd93E87qChwa@fullstackopen-ghm0k.mongodb.net/small-library?retryWrites=true&w=majority'


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB', error.message)
    })

const pubSub = new PubSub()

const typeDefs = gql`
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]! 
    id: ID!
  }
  type Author {
      name: String!
      born: Int
      ID: String!
      books: [Book!]!
      bookCount: Int!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int,
      genres: [String!]!
    ): Book
    editAuthor(
        name: String!
        newBirthday: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
    Query: {
        hello: () => { return "world" },
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (Object.entries(args).length === 0 && args.constructor === Object) {
                return Book.find({})
            } else {
                if(args['author']) {
                    const id = await getAuthorId(args.name)
                    const authorBooks = await Book.find({author: {$in: [id]}})
                    if(args['genre']) {
                        return getAuthorBooksInfo(authorBooks.filter(b => b.genres.includes(args['genre'])))
                    }
                    return getAuthorBooksInfo(authorBooks)
                } 
                return getAuthorBooksInfo(await Book.find({ genres: { $in: args['genre'] } }))
            }
        },            
        allAuthors: () => Author.find({}).populate('books'),
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addBook: async (root, args, {currentUser}) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const book = new Book({
                ...args
            })
            await book.save()
            const authorExists = await Author.findOne({name: book.author})
            if(!authorExists) {
                try {
                    author = new Author({ name: book.author, books: book })
                    await author.save()
                }
                catch (error) {
                    throw new UserInputError(error.message, {
                        invalid: args,
                    })
                }
            } else {
                await Author.findByIdAndUpdate(getAuthorId(book.author), { $inc: { bookCount: 1 }, $push: { books: book } })
                
            }
            pubSub.publish('BOOK_ADDED', { bookAdded: book })
            return book
        },
        editAuthor: async (root, args, {currentUser}) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const author = await Author.findOne({ name: args.name })
            if (author) {
                const updatedAuthor = await Author.findOneAndUpdate({ name: args.name }, { born: args.newBirthday })
                return updatedAuthor
            }
            return null
        },
        createUser: (root, args) => {
            const user = new User({ username: args.username })

            return user.save()
                .catch(error => {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secred') {
                throw new UserInputError("wrong credentials")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
        }
    }
}


const getAuthorId = async (name) => {
    const author = await Author.findOne({ name: name })
    if (!author) return null
    return author._id
}

const getAuthorBooksInfo = async (books) => {
    return books.map(b => {
        const { title, published, genres, author } = b
        return {
            title, published, genres,
            author: Author.findById(author)
        }
    })
} 

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})