const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('correct number of blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('unique identifier named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog['id']).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    _id: "41224d776a326fb40f000001",
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDB()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'React patterns 2'
  )
})

test('blog without likes is added with default 0 likes', async () => {
  const newBlog = {
    _id: "41224d776a326fb40f000001",
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const newBlogInDB = await Blog.find({title: 'React patterns 2'})
  expect(newBlogInDB[0].likes).toBe(0)
})

describe('blog without title or url is not added', () => {
  test('blog without title and url', async () => {
    const newBlog = {
      _id: "41224d776a326fb40f000001",
      author: "Michael Chan",
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDB()
  
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
  test('blog without title', async () => {
    const newBlog = {
      _id: "41224d776a326fb40f000001",
      url: "google.com",
      author: "Michael Chan",
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDB()
  
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
  test('blog without url', async () => {
    const newBlog = {
      _id: "41224d776a326fb40f000001",
      title: "React dev",
      author: "Michael Chan",
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDB()
  
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})


test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDB()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).not.toContain('React patterns')
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToUpdate = blogsAtStart[0]
  const newBlog = {
    title: "String2",
    author: "String",
    url: "String",
    likes: 30
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDB()

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('String2')
})

//still needs testing/updating
describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

describe('test invalid users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('username without required length', async() => {
    const newUser = {
      username: 'ab',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password/username min length 3')
  })
  test('password without required length', async() => {
    const newUser = {
      username: 'abc',
      name: 'Superuser',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password/username min length 3')
  })
  test('not unique username', async() => {
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain("User validation failed: username: Error, expected `username` to be unique. Value: `root`")
  })
})

afterAll(() => {
  mongoose.connection.close()
})