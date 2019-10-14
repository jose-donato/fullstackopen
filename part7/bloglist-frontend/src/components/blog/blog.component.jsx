import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';

const Blog = ({ blog, handleLike, handleRemove, userId }) => {
  const [extraInfo, setExtraInfo] = useState(false)


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

  const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3, 2),
      marginBottom: '7px',
      marginTop: '7px'
    },
  }))

  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <div onClick={handleClick} className='clickable'>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </div>
      <div className='renderAllContent'>
        {extraInfo ? renderAll() : null}
      </div>
    </Paper>
  )
}

/*Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
}*/

export default Blog