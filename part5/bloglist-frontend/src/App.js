import React, { useState, useEffect } from 'react';

import Notification from './components/notification/notification.component'
import CustomForm from './components/custom-form/custom-form.component'
import Blog from './components/blog/blog.component'
import Toggable from './components/toggable/toggable.component'

import blogService from './services/blogs'
import loginService from './services/network'
import { useField, useResource } from './hooks/index'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  //const [username, setUsername] = useState('')
  //const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  /*const title = useField('text')
  const author = useField('text')
  const title = useField('text')*/
  const username = useField('text')
  const password = useField('password')
  const [blogs, blogService] = useResource('/api/blogs')

  const blogFormRef = React.createRef()

  const clearReset = (fieldProp) => {
    const { reset, ...restOfProps } = fieldProp
    return restOfProps
  }

  useEffect(() => {
    async function fetchBlogs() {
      const initialBlogs = await blogService.getAll()
      const sortedBlogs = initialBlogs.sort(function (a, b) {
        if (a.likes > b.likes) {
          return 1
        }
        if (a.likes < b.likes) {
          return -1
        }
        return 0
      })
      blogService.setValue(sortedBlogs)
    }
    fetchBlogs()
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
          <input {...clearReset(username)} />
      </div>
      <div>
        password
          <input {...clearReset(password)} />
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
      }, user.token)
      blogService.setValue(blogs.concat(blog))
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
        username: username['value'], password: password['value']
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
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

  async function handleLike(blog) {
    const updatedBlog = await blogService.update(blog.id, { user: blog.userId, author: blog.author, title: blog.title, url: blog.url, likes: blog.likes + 1 })
    blogService.setValue(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
  }

  async function handleRemove(blog) {
    await blogService.remove(blog.id, { userId: blog.user.id })
    blogService.setValue(blogs.filter(b => b.id !== blog.id))
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
                <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleRemove={() => handleRemove(blog)} userId={user.userId} />
              ))}
            </div>
          }
        </div>
      }

    </div>
  )
}

export default App;
