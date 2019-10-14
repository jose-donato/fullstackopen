import React, { useState, useEffect } from 'react'

import Notification from './components/notification/notification.component'
import CustomForm from './components/custom-form/custom-form.component'
import Blog from './components/blog/blog.component'
import Toggable from './components/toggable/toggable.component'

import loginService from './services/network'
import { useField } from './hooks/index'
import { connect } from 'react-redux'

import { initializeUsers } from './redux/reducers/usersReducer'
import { initializeBlogs, createBlog, likeBlog, removeBlog } from './redux/reducers/blogReducer'
import { setUser, logout, setToken } from './redux/reducers/userReducer'
import { setNotification } from './redux/reducers/notificationReducer'

import {
  BrowserRouter as Router,
  Route, Link,
} from 'react-router-dom'
import User from './components/user/user.component'
import BlogInfo from './components/blog-info/blog-info.component'

import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}))


const App = ({ initializeBlogs, initializeUsers, bloglist, userlist, createBlog, likeBlog, setUser, setToken, userId, username, removeBlog, setNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const usernameField = useField('text')
  const passwordField = useField('password')


  const blogFormRef = React.createRef()
  const clearReset = (fieldProp) => {
    const { reset, ...restOfProps } = fieldProp
    return restOfProps
  }

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    initializeUsers()
  }, [initializeUsers])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <CustomForm onSubmit={handleLogin} submitText={'login'}>
      <div>
        username
        <input id="login-username" {...clearReset(usernameField)} />
      </div>
      <div>
        password
        <input id="login-password" {...clearReset(passwordField)} />
      </div>
    </CustomForm>
  )



  const addBlogForm = () => (
    <Toggable ref={blogFormRef} buttonLabel={'new blog'}>
      <h3>create new</h3>
      <CustomForm onSubmit={handleAddBlog} submitText={'create blog'}>
        <div>
          title:
          <input
            id="add-blog-title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="add-blog-author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="add-blog-url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
      </CustomForm>
    </Toggable>
  )

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObj = {
        title, author, url, userId
      }
      await createBlog(blogObj)
      setNotification({
        message: `a new blog ${title} by ${author} added`,
        style: 'success'
      }, 2)
    } catch (exception) {
      setNotification({
        message: 'wrong credentials',
        style: 'error'
      }, 2)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: usernameField['value'], password: passwordField['value']
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      setToken(user.token)
      usernameField.reset()
      passwordField.reset()
    } catch (exception) {
      setNotification({
        message: 'wrong credentials',
        style: 'error'
      }, 2)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    logout()
    window.location.reload()
  }

  async function handleLike(blog) {
    likeBlog(blog)
  }

  async function handleRemove(id) {
    removeBlog(id, { userId })
  }

  const Blogs = () => (
    <div>
      <Typography variant="h2" align="center">blogs</Typography>
      {
        <div>
          {addBlogForm()}
          {bloglist.map(blog => (
            <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleRemove={() => handleRemove(blog.id)} userId={userId} />
          ))}
        </div>
      }
    </div>
  )

  const Users = () => (
    <div>
      <Typography variant="h2" align="center">users</Typography>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
          {userlist.map(u => (
            <tr key={u.username}>
              <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const classes = useStyles()


  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <div className={classes.root}>
        <Router>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6">
                <Link to="/" style={{ padding: 5 }}>blogs</Link>
              </Typography>
              <Typography variant="h6">
                <Link to="/users" style={{ padding: 5 }}>users</Link>
              </Typography>

              {username === '' ?
                <p>log in to application</p>
                :
                <p>{username} logged in <Button variant="contained" onClick={handleLogout} type="submit">logout</Button></p>
              }
            </Toolbar>
          </AppBar>
          <Notification />

          <Route exact path="/" render={() => {
            return username === '' ?
              <div>
                {loginForm()}
              </div> :
              <div>
                <Blogs />
              </div>
          }} />
          <Route exact path="/users" render={() => {
            return (
              <Users />
            )
          }} />
          <Route exact path="/users/:id" render={({ match }) => <User userId={match.params.id}/>}
          />
          <Route exact path="/blogs/:id" render={({ match }) => <BlogInfo blog={bloglist.filter(b => b.id === match.params.id)[0]} />} />
        </Router>
      </div>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    name: state.user.name,
    userId: state.user.userId,
    bloglist: state.blogs,
    userlist: state.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    logout: () => dispatch(logout()),
    setToken: (token) => dispatch(setToken(token)),
    initializeBlogs: () => dispatch(initializeBlogs()),
    createBlog: (blog) => dispatch(createBlog(blog)),
    likeBlog: (blog) => dispatch(likeBlog(blog)),
    removeBlog: (id, data) => dispatch(removeBlog(id, data)),
    setNotification: (message, time) => dispatch(setNotification(message, time)),
    initializeUsers: () => dispatch(initializeUsers())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
