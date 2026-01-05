const loginRouter = require('express').Router()
const User = require('../models/user.cjs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { password, username } = request.body

  if (!password || !username) return response
    .status(400)
    .json({ error: 'Missing username or password' })

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) return response.status(401).json({ error: 'Invalid username or password' })

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter