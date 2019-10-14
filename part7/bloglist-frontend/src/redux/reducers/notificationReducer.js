const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION'
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

const createNotification = (content) => {
    return {
        type: CREATE_NOTIFICATION,
        content,
    }
}

const removeNotification = () => {
    return {
        type: REMOVE_NOTIFICATION,
    }
}

export const setNotification = (content, timeout) => {
    return async (dispatch) => {
        dispatch(createNotification(content))
        setTimeout(() => {
            dispatch(removeNotification())
        }, timeout*1000)
    }
}

const INITIAL_STATE = {
    message: '',
    style: 'hidden',
}

const notificationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_NOTIFICATION:
            return action.content
        case REMOVE_NOTIFICATION:
            return INITIAL_STATE
        default:
            return state
    }
}

export default notificationReducer