import React from 'react'
import { connect } from 'react-redux'

import { voteAnecdote } from '../../redux/reducers/anecdoteReducer'
import {addNotification} from '../../redux/reducers/notificationReducer'

const AnecdoteList = ({anecdotes, voteAnecdote, addNotification}) => {
  const vote = (anecdote) => {
    voteAnecdote(anecdote)
    addNotification({message: `'${anecdote.content}' voted`}, 5)
  }

  return(
    <div>
      {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

const anecdotesToShow = ({ anecdotes, filter }) => {
  return anecdotes.filter(a => a.content.includes(filter)).sort(function (a, b) {
    if (a.votes < b.votes) {
      return 1
    }
    if (a.votes > b.votes) {
      return -1
    }
    return 0
  })
}

const mapStateToProps = (state) => {
  return {
    anecdotes: anecdotesToShow(state),
  } 
}
const mapDispatchToProps = {
  voteAnecdote,
  addNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
