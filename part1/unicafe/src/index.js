import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import CustomButton from './components/custom-button/custom-button.component'
import Stats from './components/stats/stats.component'

const App = () => {
    // save clicks of each button to own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleClick = (feedback) => {
        switch (feedback) {
            case "good":
                setGood(good + 1)
                break
            case "neutral":
                setNeutral(neutral + 1)
                break
            case "bad":
                setBad(bad + 1)
                break
            default:
                break
        }
    }

    const all = good + neutral + bad
    const positive = (good / all) * 100
    const average = (good - bad) / all

    const getStats = () => {
        if (all === 0) {
            return (
                <>
                    <Stats type={"average"} value={0} />
                    <Stats type={"positive"} value={0 + " %"} />
                </>
            )
        }
        return (
            <>
                <Stats type={"average"} value={average} />
                <Stats type={"positive"} value={positive + " %"} />
            </>
        )
    }
    return (
        <div>
            <h1>give feedback</h1>
            <CustomButton text={"good"} handleClick={() => handleClick("good")} />
            <CustomButton text={"neutral"} handleClick={() => handleClick("neutral")} />
            <CustomButton text={"bad"} handleClick={() => handleClick("bad")} />
            <br />
            <h1>statistics</h1>
            <table>
                <tbody>
                    <Stats type={"good"} value={good} />
                    <Stats type={"neutral"} value={neutral} />
                    <Stats type={"bad"} value={bad} />
                    <Stats type={"all"} value={all} />
                    {getStats()}
                </tbody>
            </table>

        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)