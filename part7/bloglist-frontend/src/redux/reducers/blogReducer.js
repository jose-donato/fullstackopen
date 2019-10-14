import blogService from '../../services/blogs'


const INITIALIZE_BLOGS = 'INITIALIZE_BLOGS'
const ADD_BLOG = 'ADD_BLOG'
const REMOVE_BLOG = 'REMOVE_BLOG'
const LIKE_BLOG = 'LIKE_BLOG'
const ADD_COMMENT = 'ADD_COMMENT'

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch({
            type: INITIALIZE_BLOGS,
            data: blogs,
        })
    }
}

export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        dispatch({
            type: ADD_BLOG,
            data: newBlog,
        })
    }
}

export const removeBlog = (id, data) => {
    return async dispatch => {
        const remainingBlogs = await blogService.remove(id, data)
        dispatch({
            type: REMOVE_BLOG,
            data: remainingBlogs,
        })
    }
}

export const likeBlog = (obj) => {
    return async (dispatch) => {
        const uObj = {
            ...obj, likes: obj.likes + 1
        }
        const updatedBlog = await blogService.update(obj.id, uObj)
        dispatch({
            type: LIKE_BLOG,
            data: updatedBlog
        })
    }
}

export const addComent = (obj, comment) => {
    const uObj = {
        ...obj, comments: [...obj.comments, comment]
    }
    return async (dispatch) => {
        const updatedBlog = await blogService.update(obj.id, uObj)
        dispatch({
            type: ADD_COMMENT,
            data: updatedBlog
        })
    }
}

const reducer = (state = [], action) => {
    switch (action.type) {
        case REMOVE_BLOG:
            return action.data
        case INITIALIZE_BLOGS:
            return action.data
        case ADD_BLOG:
            return [...state, action.data]
        case LIKE_BLOG:
            return state.map(blog =>
                blog.id !== action.data.id ? blog : action.data
            )
        case ADD_COMMENT:
            return state.map(blog =>
                blog.id !== action.data.id ? blog : action.data
            )
        default:
            return state
    }
}

export default reducer