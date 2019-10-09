import React from 'react'


import AddAnecdote from './components/add-anecdote/add-anecdote.component'
import AnecdoteList from './components/anecdote-list/anecdote-list.component'
import Notification from './components/notification/notification.component'
import Filter from './components/filter/filter.component'

const App = ({store}) => {  
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification store={store} />
      <Filter store={store} />
      <AnecdoteList store={store} />
      <AddAnecdote store={store} />
    </div>
  )
}

export default App