import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import NewBlog from './new-blog'

const blog = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 8,
  user: {
    name: 'Superuser',
    username: 'root',
    id: '692e7ff308969e8b36be2ba0'
  },
  id: '5a422aa71b54a676234d17f8'
}

vi.mock('../services/blogs', () => ({
  default: {
    likeBlog: vi.fn(() => Promise.resolve()),
    deleteBlog: vi.fn(() => Promise.resolve()),
  },
}))

const blogToRender = <Blog requestBlog={blog} user={blog.user} onRemove={() => null} onLiked={() => null} ></Blog>

test('Testing blog details is hide by default', () => {
  render(blogToRender)

  const toBeFound = screen.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')
  expect(toBeFound).toBeDefined()

  const notToBeFound = screen.queryByText('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
  expect(notToBeFound).toBeNull()
})

test('Testing blog details are shown', async () => {
  render(blogToRender)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeCountFound = screen.queryByText('8')
  const urlFound = screen.queryByText('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
  expect(urlFound).toBeDefined()
  expect(likeCountFound).toBeDefined()
})

test('Test like button correctly clicked', async () => {
  const onLiked = vi.fn()
  render(<Blog requestBlog={blog} user={blog.user} onRemove={() => null} onLiked={onLiked} ></Blog>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(onLiked.mock.calls).toHaveLength(2)
})

test('Test new blog value are correctly registered', async () => {
  const createNewBlog = vi.fn()
  render(<NewBlog createNewBlog={createNewBlog} ></NewBlog>)

  const user = userEvent.setup()
  const title = screen.getByLabelText('title:')
  await user.type(title, 'A book title')

  const author = screen.getByLabelText('author:')
  await user.type(author, 'A book author')

  const url = screen.getByLabelText('url:')
  await user.type(url, 'A book url')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createNewBlog.mock.calls).toHaveLength(1)
  expect(createNewBlog.mock.calls[0][0]).toStrictEqual({
    title: 'A book title',
    author: 'A book author',
    url: 'A book url'
  })
})
