import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (
    <div>
        <div>
            <span className='title'>{blog.title}</span> <span className='author'>{blog.author}</span>
        </div>
        <div>
            blog has <span className='likes'>{blog.likes}</span> likes
      <button onClick={onClick}>like</button>
        </div>
    </div>
)

export default SimpleBlog