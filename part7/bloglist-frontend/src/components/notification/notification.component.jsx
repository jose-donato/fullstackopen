import React from 'react'
import { connect } from 'react-redux'
import './notification.styles.css'

const Notification = ({ notification }) => {
    if (notification.message === null) {
        return null
    }

    return (
        <div className={notification.style}>
            {notification.message}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

export default connect(mapStateToProps)(Notification)