const jwt = require('jsonwebtoken')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(body.userId)
    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      //part7 
      comments: body.comments,
      //
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result.toJSON())
  } catch (e) {
    next(e)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === request.body.userId.toString()) {
      const result = await Blog.findByIdAndDelete(request.params.id)
      return response.status(204).end()
    }
    else {
      return response.status(401).json({ error: 'you didn\'t create this blog' })
    }
  } catch (e) {
    next(e)
    response.status(400).json({ e })
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  try {
    const blog = {
      title: body.title,
      author: body.author,
      likes: body.likes,
      userId: body.userId,
      //part7
      comments: body.comments,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    res.json(updatedBlog.toJSON())
  } catch (e) {
    next(e)
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog.toJSON())
})

module.exports = blogsRouter