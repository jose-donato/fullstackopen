import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient } from '@apollo/react-hooks'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

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
        show={page === 'books'}
      />
      {token ? 
      
      <NewBook
        show={page === 'add'}
      /> 

      
      
      : null}
      
      <Login show={page === 'login'} setToken={setToken}/>

    </div>
  )
}

export default App