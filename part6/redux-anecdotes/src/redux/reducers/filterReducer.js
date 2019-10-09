export const SET_FILTER = 'SET_FILTER'

export const setFilter = (data) =>  {
    return {
        type: SET_FILTER,
        data
    }
}

const initialState = {
    filter: ''
}


const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_FILTER:
            return { filter: action.data.filter}
        default:
            return state
    }
}

export default reducer