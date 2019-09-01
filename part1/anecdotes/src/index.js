import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import CustomButton from './components/custom-button/custom-button.component'

const random = (length) => Math.floor(Math.random() * length)

const App = (props) => {
    const [selected, setSelected] = useState(0)

    const handleClick = () => {
        console.log("dlawoldwaodaw")
        const rand = random(10)
        setSelected(rand)
        console.log(selected)
    }

    return (
        <div>
            <div>
                {props.anecdotes[selected]}
            </div>
            <CustomButton text={"next anecdote"} onClick={() => console.log("dlwaldwla")} />
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