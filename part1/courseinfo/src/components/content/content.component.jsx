import React from 'react'
import Part from '../part/part.component'

const Content = ({ parts }) => (
    <div>
        <Part part={parts[0].name} exercises={parts[0].exercises} />
        <Part part={parts[1].name} exercises={parts[1].exercises} />
        <Part part={parts[2].name} exercises={parts[2].exercises} />
    </div>
)

export default Content