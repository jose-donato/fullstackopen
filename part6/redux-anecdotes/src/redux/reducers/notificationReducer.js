export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION'


export const addNotification = (data, timeout) => async dispatch => {
    dispatch({
        type: ADD_NOTIFICATION,
        data
    })
    setTimeout(() => dispatch({ type: CLEAR_NOTIFICATION }), timeout)
}

export const clearNotification = () => {
    return { type: CLEAR_NOTIFICATION }
}

const initialState = {
    message: 'test'
}


const reducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_NOTIFICATION:
            return { message: action.data.message}
        case CLEAR_NOTIFICATION:
            return initialState
        default:
            return state
    }
}

export default reducer