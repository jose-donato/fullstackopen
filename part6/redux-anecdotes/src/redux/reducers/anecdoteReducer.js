const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)


export const ADD_NOTE = 'ADD_NOTE'
export const LIKE_NOTE = 'LIKE_NOTE'


export const addNote = (data) => {
  return { type: ADD_NOTE, data }
}

export const likeNote = (data) => {
  return { type: LIKE_NOTE, data }
}


const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
    case ADD_NOTE:
      return [...state, asObject(action.data.title)]
    case LIKE_NOTE:
      return state.map(note => note.id === action.data.id ? {...note, votes: note.votes+1} : note)
    default:
      return state
  }
}

export default reducer