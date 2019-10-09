import React from 'react'

import { likeNote } from '../../redux/reducers/anecdoteReducer'
import {addNotification} from '../../redux/reducers/notificationReducer'

const AnecdoteList = ({store}) => {

  

    const anecdotes = store.getState().anecdotes.filter(a => a.content.includes(store.getState().filter.filter)).sort(function (a, b) {
        if (a.votes < b.votes) {
          return 1
        }
        if (a.votes > b.votes) {
          return -1
        }
        return 0
      });
    
      const vote = (id, content) => {
        store.dispatch(likeNote({ id }))
        store.dispatch(addNotification({message: `'${content}' voted`}, 5000))
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
                    <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList