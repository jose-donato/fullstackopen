import React from 'react'

import Header from '../header/header.component'
import Content from '../content/content.component'
import Total from '../total/total.content'

const Course = ({ course }) => (
    <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course