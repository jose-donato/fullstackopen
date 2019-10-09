import React, {useState} from 'react'
import {addNote} from '../../redux/reducers/anecdoteReducer'
import {addNotification} from '../../redux/reducers/notificationReducer'

const AddAnecdote = ({store}) => {
    const [text, setText] = useState('')
    const add = () => {
        store.dispatch(addNote({ title: text }))
        setText('')
        store.dispatch(addNotification({message: `'${text}' added`}, 5000))
      }
    
    return (
        <div>
            <h2>create new</h2>
            <div>
                <div><input onChange={e => setText(e.target.value)} value={text} required/></div>
                <button onClick={add}>create</button>
            </div>
        </div>
    )
}

export default AddAnecdote