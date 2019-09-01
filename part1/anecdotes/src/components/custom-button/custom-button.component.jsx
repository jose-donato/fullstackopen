import React from 'react'

const CustomButton = ({ text, handleClick }) => (
    <button onClick={handleClick}>{text}</button>
)

export default CustomButton