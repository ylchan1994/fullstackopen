const userRouter = require('express').Router()
const User = require('../models/user.cjs')
const bcrypt = require('bcryptjs')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { name, password, username } = request.body
  const id = request.body._id

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const requestBody = {
    name: name,
    username: username,
    passwordHash: passwordHash
  }
  if (id) requestBody._id = id

  if (!name || !password || !username) return response
    .status(400)
    .json({ error: 'Either username or password is missing' })

  if (password.length < 3) return response
    .status(400)
    .json({ error: 'Password require minimum 3 characters' })



  const user = new User(requestBody)

  const result = await user.save()
  response.status(201).json(result)
})

module.exports = userRouter