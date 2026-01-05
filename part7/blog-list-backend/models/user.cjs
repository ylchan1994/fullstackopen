const mongoose = require('mongoose')
const { MONGO_URI } = require('../utils/config.cjs')

const mongoUrl = MONGO_URI

mongoose.set('strictQuery', false)

const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true // this ensures the uniqueness of username
  },
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

mongoose.connect(mongoUrl, { family: 4 })

module.exports = User