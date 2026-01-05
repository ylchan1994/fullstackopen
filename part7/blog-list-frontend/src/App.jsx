import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import UserInfo from './components/user-info'
import NewBlog from './components/new-blog'
import blogService from './services/blogs'
import LoginForm from './components/login-form'
import loginService from './services/login'
import FloatingMessage from './components/floating-message'
import Toggleable from './components/toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [floatingMessage, setFloatingMessage] = useState(null)
  const newBlogFormRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const loggedUser = await loginService.userLogin(username, password)
      setUser(loggedUser)
      localStorage.setItem('user', JSON.stringify(loggedUser))
    } catch (error) {
      console.log(error.message)
      setFloatingMessage({
        message: 'wrong username or password',
        style: 'fail'
      })
      setTimeout(() => setFloatingMessage(null), 5000)
    }

    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    setUser('')
    localStorage.setItem('user', '')
  }

  const handleCreate = async (blog) => {
    await blogService.createBlog(user.token, blog)
    setFloatingMessage({
      message: `a new blog ${blog.title} by ${blog.author} added`,
      style: 'success'
    })
    setTimeout(() => setFloatingMessage(null), 5000)

    newBlogFormRef.current()
    const newBlogs = await blogService.getAll()
    newBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(newBlogs)
  }

  const handleBlogLiked = async () => {
    console.log('this is run')
    const newBlogs = await blogService.getAll()
    newBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(newBlogs)
  }

  const handleCancelNewBlog = (e) => {
    e.preventDefault()
    newBlogFormRef.current()
  }

  const handleRemove = () => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })

    if (localStorage.getItem('user') !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user'))
      setUser(loggedInUser)
    }
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <FloatingMessage
        message={floatingMessage?.message}
        style={floatingMessage?.style}
      >
      </FloatingMessage>

      {!user &&
        <LoginForm
          username={username}
          password={password}
          onPasswordChange={({ target }) => setPassword(target.value)}
          onUsernameChange={({ target }) => setUsername(target.value)}
          onSubmit={handleSubmit}
        >
        </LoginForm>
      }

      {user &&
        <div>
          <UserInfo
            onLogout={handleLogout}
            user={user}
          ></UserInfo>
          <Toggleable ref={newBlogFormRef} buttonLabel='create new blog'>
            <NewBlog
              createNewBlog={handleCreate}
              onCancel={handleCancelNewBlog}
            ></NewBlog>
          </Toggleable>
          {blogs.map(blog => <Blog key={blog.id} requestBlog={blog} user={user} onLiked={handleBlogLiked} onRemove={handleRemove}/>)}
        </div>
      }

    </div>
  )
}

export default App