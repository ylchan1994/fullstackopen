const resetRouter = require('express').Router()
const Blog = require('../models/blog-list.cjs')
const User = require('../models/user.cjs')

resetRouter.post('/reset', async (request, response) => {
  console.log('to double check reset is run')
  await User.deleteMany({})
  await Blog.deleteMany({})
  response.status(204).end()
})

module.exports = resetRouter