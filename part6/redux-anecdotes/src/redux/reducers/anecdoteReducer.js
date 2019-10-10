import anecdoteService from '../../services/anecdotes'
const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}



export const ADD_NOTE = 'ADD_NOTE'
export const LIKE_NOTE = 'LIKE_NOTE'
export const INIT_ANECDOTES = 'INIT_ANECDOTES'
export const NEW_ANECDOTE = 'NEW_ANECDOTE'
export const VOTE_ANECDOTE = 'VOTE_ANECDOTE'


export const addNote = (data) => {
  return { type: ADD_NOTE, data }
}

export const likeNote = (data) => {
  return { type: LIKE_NOTE, data }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: INIT_ANECDOTES,
      data: anecdotes,
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch =>  {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: NEW_ANECDOTE,
      data: newAnecdote,
    })
  }
}

export const voteAnecdote = (obj) => {
  return async (dispatch) => {
    const uObj = {
      ...obj, votes: obj.votes+1
    }
    const updatedAnecdote = await anecdoteService.update(uObj)
    dispatch({
      type: VOTE_ANECDOTE,
      data: updatedAnecdote
    })
  }
}

const reducer = (state = [], action) => {
  switch(action.type) {
    case ADD_NOTE:
      return [...state, asObject(action.data.title)]
    case LIKE_NOTE:
      return state.map(note => note.id === action.data.id ? {...note, votes: note.votes+1} : note)
    case INIT_ANECDOTES:
      return action.data
    case NEW_ANECDOTE:
      return [...state, action.data]
    case VOTE_ANECDOTE:
      const id = action.data.id
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.data
      )
    default:
      return state
  }
}

export default reducer