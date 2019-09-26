import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, userId }) => {
  const [extraInfo, setExtraInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleClick = () => {
    setExtraInfo(!extraInfo)
  }



  const renderAll = () => (
    <div>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes </p> <button type='submit' onClick={handleLike}>like</button>
      {blog.user ? <p>added by {blog.user.username}</p> : <p>added by unknown</p>}
      {blog.user.id === userId ? <button type='submit' onClick={handleRemove}>remove</button> : null}
    </div>
  )

  return (
    <div style={blogStyle}>
      <div onClick={handleClick}>
        {blog.title} {blog.author}
      </div>
      {extraInfo ? renderAll() : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
}

export default Blog