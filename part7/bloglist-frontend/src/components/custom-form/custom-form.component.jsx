import React from 'react'

const CustomForm = ({ onSubmit, children, submitText }) => (
    <form onSubmit={onSubmit}>
        <div>
            {children}
            <button type="submit">{submitText}</button>
        </div>
    </form>
)

export default CustomForm