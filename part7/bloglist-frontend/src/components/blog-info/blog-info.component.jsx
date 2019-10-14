import React from 'react'
import { connect } from 'react-redux'
import { removeBlog, likeBlog, addComent } from '../../redux/reducers/blogReducer'
import { setNotification } from '../../redux/reducers/notificationReducer'
import { withRouter } from 'react-router-dom'
import { useField } from '../../hooks/index'
import CustomForm from '../custom-form/custom-form.component'

const BlogInfo = ({blog, currentUserId, likeBlog, removeBlog, setNotification, addComent, history}) => {
    const commentField = useField('text')    
    async function handleLike(blog) {
        likeBlog(blog)
    }

    async function handleRemove(id) {
        removeBlog(id, { userId: currentUserId })
        history.push("/")
    }


    const clearReset = (fieldProp) => {
        const { reset, ...restOfProps } = fieldProp
        return restOfProps
    }

    const handleAddComent = async (event) => {
        event.preventDefault()
        addComent(blog, commentField['value'])
        commentField.reset()
    }


    const renderAll = () => (
        <div>
            <a href={blog.url}>{blog.url}</a>
            <p>{blog.likes} likes </p> <button type='submit' onClick={() => handleLike(blog)}>like</button>
            {blog.user ? <p>added by {blog.user.username}</p> : <p>added by unknown</p>}
            {blog.user.id === currentUserId ? <button type='submit' onClick={() => handleRemove(blog.id)}>remove</button> : null}
            {blog.comments ? 
                <div>
                    <h2>comments</h2>
                    <CustomForm onSubmit={handleAddComent} submitText={'add comment'}>
                        <div>
                            <input {...clearReset(commentField)} />
                        </div>
                    </CustomForm>
                    <ul>
                        {blog.comments.map(c =>
                            <li key={c}>{c}</li>
                        )}
                    </ul>
                </div>:
                <p>no comments on this blog</p>
                }
        </div>
    )

    return (
        <div>
            <h2>{blog.title} {blog.author}</h2>
            {renderAll()}
        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        currentUserId: state.user.userId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        likeBlog: obj => dispatch(likeBlog(obj)),
        removeBlog: (id, data) => dispatch(removeBlog(id, data)),
        setNotification: (message, time) => dispatch(setNotification(message, time)),
        addComent: (blog, comment) => dispatch(addComent(blog, comment))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlogInfo))