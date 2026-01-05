const blogRouter = require('express').Router()
const Blog = require('../models/blog-list.cjs')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  const transformedRequest = request.body

  transformedRequest.user = request.user.toString()

  if (!title || !url) return response.status(400).json({ error: 'Title or URL is missing' })

  if (!transformedRequest.likes) transformedRequest.likes = 0
  const blog = new Blog(transformedRequest)

  const result = await blog.save()

  await result.populate('user', { username: 1, name: 1 })
  response.status(201).json(result)
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const likes = request.body?.likes

  if (!likes) return response.status(400).json({ error: 'Unable to update due to missing likes' })

  const found = await Blog.findById(id)
  if (!found) return response.status(404).json({ error: 'Blog id not found' })

  found.likes = likes

  const updatedBlog = await found.save()
  await updatedBlog.populate('user', { username: 1, name: 1 })
  response.status(200).json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const found = await Blog.findById(id)

  if (!found) return response.status(404).end()
  console.log(found)
  if (found.user?.toString() !== request.user) return response.status(403).json({ error: 'User does not have permission to delete this blog' })

  const afterDelete = await Blog.deleteOne({ _id: id })
  if (afterDelete.deletedCount !== 1) return response.status(404).end()
  response.status(204).end()
})

module.exports = blogRouter