import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient, useSubscription } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'


const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  author {
    name
    born
    bookCount
  }
  published
  genres
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const title = subscriptionData.data.bookAdded.title
      const message = `added ${title} to booklist`
      window.alert(message)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        
        {token ? 
        <div>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
        </div>
        : <button onClick={() => setPage('login')}>login</button>}
        
      </div>

      <Authors token={token}
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'} type={'books'}
      />
      {token ? 
      <div>     
        <NewBook
          show={page === 'add'}
        /> 
        <Books
          show={page === 'recommend'} type={'recommend'}
        />
      </div>     
      
      : null}
      
      <Login show={page === 'login'} setToken={setToken}/>

    </div>
  )
}

export default App