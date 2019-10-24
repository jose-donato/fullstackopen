import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const CREATE_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`

const ALL_BOOKS = gql`
{
  allBooks  {
    title
    author {
      name
      born
      bookCount
    }
    published
  }
}
`


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const client = useApolloClient()

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      return (set.map(book => book.id)).includes(object.id)
    }

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  }

  return (
    <div>
      <Mutation mutation={CREATE_BOOK} refetchQueries={[{ query: ALL_BOOKS }]} update={(store, response) => updateCacheWith(response.data.addBook)}>
        {(addBook) =>
          <form onSubmit={() => addBook({
            variables: { title, author, published: parseInt(published), genres }
          })}>
            <div>
              title
            <input
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author
            <input
                value={author}
                onChange={({ target }) => setAuhtor(target.value)}
              />
            </div>
            <div>
              published
            <input
                type='number'
                value={published}
                onChange={({ target }) => setPublished(target.value)}
              />
            </div>
            <div>
              <input
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
              />
              <button onClick={addGenre} type="button">add genre</button>
            </div>
            <div>
              genres: {genres.join(' ')}
            </div>
            <button type='submit'>create book</button>
          </form> 
        }
      </Mutation>
    </div>
  )
}

export default NewBook