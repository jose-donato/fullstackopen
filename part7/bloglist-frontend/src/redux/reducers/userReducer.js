import blogService from '../../services/blogs'

const SET_USER = 'SET_USER'
const SET_TOKEN = 'SET_TOKEN'
const LOGOUT = 'LOGOUT'

const INITIAL_STATE = {
  username: '',
  name: '',
  userId: ''
}


export const setUser = (user) => {
  return {
    type: SET_USER,
    data: user
  }
}

export const setToken = (token) => {
  return async (dispatch) => {
    await blogService.setToken(token)
    dispatch({
      type: SET_TOKEN,
    })
  }
}

export const logout = () => {
  return {
    type: LOGOUT
  }
}

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      username: action.data.username,
      name: action.data.name,
      userId: action.data.userId,
      token: action.data.token,
    }
  case SET_TOKEN:
    return state
  case LOGOUT:
    return INITIAL_STATE
  default:
    return state
  }
}

export default userReducer