require('dotenv').config()

let PORT = process.env.PORT
let MONGO_URI = process.env.NODE_ENV === 'prod' ? process.env.MONGO_URI : process.env.TEST_MONGO_URI

module.exports = { MONGO_URI, PORT }
