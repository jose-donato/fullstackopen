import React, { useState } from 'react'
import blogService from '../../services/blogs'

const Blog = ({ blog }) => {
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

  const handleLike = async () => {
    const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    blog = updatedBlog
  }

  const handleRemove = async () => {
    await blogService.remove(blog.id, { userId: blog.user })
  }

  const renderAll = () => (
    <div>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes </p> <button type='submit' onClick={handleLike}>like</button>
      <p>added by {blog.user}</p>
      <button type='submit' onClick={handleRemove}>remove</button>
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
export default Blog