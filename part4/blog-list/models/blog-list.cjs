const mongoose = require('mongoose')
const { MONGO_URI } = require('../utils/config.cjs')

const mongoUrl = MONGO_URI

mongoose.set('strictQuery', false)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(mongoUrl, { family: 4 })

module.exports = Blog