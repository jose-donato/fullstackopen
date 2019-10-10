import React, {useState} from 'react'
import { connect } from 'react-redux'

import {createAnecdote} from '../../redux/reducers/anecdoteReducer'
import {addNotification} from '../../redux/reducers/notificationReducer'

const AddAnecdote = ({ createAnecdote, addNotification }) => {
    const [text, setText] = useState('')
    const add = async () => {
        createAnecdote(text)
        setText('')
        addNotification({message: `'${text}' added`}, 5)
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

const mapStateToProps = (state) => {
    return {
        anecdotes: state.anecdotes,
        filter: state.filter
    }
}
const mapDispatchToProps = {
    createAnecdote,
    addNotification
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAnecdote)
