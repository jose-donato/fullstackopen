import React, { useState, useEffect } from 'react';

import Notification from './components/notification/notification.component'
import CustomForm from './components/custom-form/custom-form.component'
import Blog from './components/blog/blog.component'
import Toggable from './components/toggable/toggable.component'

import blogService from './services/blogs'
import loginService from './services/network'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = React.createRef()


  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <CustomForm onSubmit={handleLogin} submitText={'login'}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
    </CustomForm>
  )



  const addBlogForm = () => (
    <Toggable ref={blogFormRef} buttonLabel={'new blog'}>
      <h3>create new</h3>
      <CustomForm onSubmit={handleAddBlog} submitText={'create'}>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
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
      const userId = user.userId
      const blog = await blogService.create({
        title, author, url, userId
      })
      setBlogs(blogs.concat(blog))
      setSuccessMessage(`a new blog ${title} by ${author} added`)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <div className="App">
      <Notification message={errorMessage} type={'error'} />
      <Notification message={successMessage} type={'success'} />
      {user === null ?
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div> :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout} type="submit">logout</button></p>
          {
            <div>
              {addBlogForm()}
              {blogs.map(blog => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
          }
        </div>
      }

    </div>
  )
}

export default App;
