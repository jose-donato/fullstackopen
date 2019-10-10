const initialState = {
    good: 0,
    ok: 0,
    bad: 0
}

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GOOD':
            console.log(state)
            return {...state, good: state.good + 1}
        case 'OK':
            return { ...state, good: state.ok + 1 }
        case 'BAD':
            return { ...state, good: state.bad + 1 }
        case 'ZERO':
            return {
                good: 0,
                ok: 0,
                bad: 0
            }
        default:
            return state
    }
}

export default counterReducer