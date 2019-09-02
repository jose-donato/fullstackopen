import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import CustomButton from './components/custom-button/custom-button.component'

const random = (length) => Math.floor(Math.random() * length)

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [points, setPoints] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    const [max, setMax] = useState(0)

    const handleVote = () => {
        const newPoints = { ...points }
        newPoints[selected] += 1
        setPoints(newPoints)
        mostVotes()
    }
    const handleNext = () => {
        const rand = random(anecdotes.length - 1)
        setSelected(rand)
    }

    const mostVotes = () => {
        const max = Object.keys(points).reduce(function (prev, current) {
            if (points[prev] < points[current]) return current
            return prev
        })
        setMax(max)
    }

    return (
        <div>
            <div>
                <h1>Anecdote of the day</h1>
                <p>{props.anecdotes[selected]}</p>
                <p>has {points[selected]} votes</p>
                <h1>Anecdote with most votes</h1>
                <p>{props.anecdotes[max]}</p>
                <p>has {points[max]} votes</p>

            </div>
            <CustomButton text={"next anecdote"} handleClick={handleNext} />
            <CustomButton text={"vote"} handleClick={handleVote} />

        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)