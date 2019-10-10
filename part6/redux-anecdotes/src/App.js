import React, { useEffect } from 'react'
import { connect } from 'react-redux'


import AddAnecdote from './components/add-anecdote/add-anecdote.component'
import AnecdoteList from './components/anecdote-list/anecdote-list.component'
import Notification from './components/notification/notification.component'
import Filter from './components/filter/filter.component'

import { initializeAnecdotes } from './redux/reducers/anecdoteReducer'

const App = ({ initializeAnecdotes }) => {  
  useEffect(() => {
    initializeAnecdotes()
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AddAnecdote  />
    </div>
  )
}

export default connect(null, { initializeAnecdotes })(App)
