const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app.cjs')
const assert = require('node:assert')
const Blog = require('../../models/blog-list.cjs')
const helper = require('./test-helper.cjs')
const User = require('../../models/user.cjs')

const api = supertest(app)

let token = ''

beforeEach(async () => {

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogList)
  const getToken = await api
    .post('/api/login')
    .send({
      username: helper.rootUser.username,
      password: helper.rootUser.password
    })

  token = getToken.body.token

  await User.deleteMany({})
  const rootUser = helper.rootUser

  await api.post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(rootUser)
})

describe('Testing basic API return data', async () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('JSON response use id instead of _id', async () => {
    const response = await api
      .get('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body[0]
    assert.strictEqual(Object.hasOwnProperty.call(blogs, 'id'), true)
  })
})

describe('Testing positive API cases', async () => {
  test('Blogs count are return correctly', async () => {
    const response = await api
      .get('/api/blog-list')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(response.body.length, blogsInDb.length)
  })

  test('Blog successfully added and content are correct', async () => {
    const requestBody = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: '692e7ff308969e8b36be2ba0'
    }
    const requestResponse = await api
      .post('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const requestResponseBody = requestResponse.body
    const blogsInDb = await helper.blogsInDb()


    assert.strictEqual(blogsInDb.length, helper.initialBlogList.length + 1)
    assert.strictEqual(requestResponseBody.title, requestBody.title)
    assert.strictEqual(requestResponseBody.author, requestBody.author)
    assert.strictEqual(requestResponseBody.url, requestBody.url)
    assert.strictEqual(requestResponseBody.likes, requestBody.likes)
  })

  test('Blog added with no likes auto appended with 0 likes', async () => {
    const requestBody = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      user: '692e7ff308969e8b36be2ba0'
    }
    const response = await api
      .post('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('Blog count are correct after deleting', async () => {
    const id = helper.initialBlogList[0]._id
    await api.delete(`/api/blog-list/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsInDb = await helper.blogsInDb()


    assert.strictEqual(blogsInDb.length, helper.initialBlogList.length - 1)
  })

  test('Correctly updating the likes for a blog', async () => {
    const newLikes = 54
    const id = helper.initialBlogList[0]._id

    const afterUpdate = await api
      .put(`/api/blog-list/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(afterUpdate.body.likes, newLikes)
  })
})

describe('Testing negative API cases', async () => {
  test('Missing token in request return error 401', async () => {
    const requestBody = {
      author: 'Edsger W. Dijkstra',
      title: 'Canonical string reduction',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }
    await api
      .post('/api/blog-list')
      .send(requestBody)
      .expect(401)
  })

  test('Missing title return error 400', async () => {
    const requestBody = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }
    await api
      .post('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400)

  })

  test('Missing URL return error 400', async () => {
    const requestBody = {
      author: 'Edsger W. Dijkstra',
      title: 'Canonical string reduction',
    }
    await api
      .post('/api/blog-list')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(400)

  })

  test('ID not found will return error 404', async () => {
    const id = await helper.nonExistingId()
    await api.delete(`/api/blog-list/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('Missing like in update return error 400', async () => {
    const id = helper.initialBlogList[0]._id

    await api
      .put(`/api/blog-list/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('ID not found during update will return error 404', async () => {
    const id = await helper.nonExistingId()

    await api
      .put(`/api/blog-list/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 546 })
      .expect(404)
  })
})

describe('Test user creation flow', async () => {

  test('Successful create with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('Duplicate username return error 400 and require unique username message', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('expected `username` to be unique'))
  })

  test('Invalid password fail to create user and return error 400', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'some one',
      name: 'test short password',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('Password require minimum 3 characters'))
  })
})

after(async () => {
  await mongoose.connection.close()
})