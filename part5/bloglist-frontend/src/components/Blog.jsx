import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ requestBlog, user, onLiked, onRemove }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false)
  const [blog, setBlog] = useState({})
  const [isRemoveVisible, setIsRemoveVisible] = useState(true)

  console.log(requestBlog, user)

  useEffect(() => {
    setBlog(requestBlog)
    setIsRemoveVisible(requestBlog?.user?.username === user?.username)
  })

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const BlogDetails = ({ onClick, isRemoveVisible }) => (
    <div>
      <div>{blog.url}</div>
      <div className='likes'>
        {blog.likes}
        <button type='button' onClick={handleLike}>like</button>
      </div>
      <div>{blog.author}</div>
      <div>{blog.user?.name}</div>
      {isRemoveVisible ?
        <button type='button' onClick={onClick}>remove</button> :
        null}
    </div>
  )

  const handleViewOrHide = () => setIsDetailsVisible(!isDetailsVisible)

  const handleLike = async () => {
    await blogService.likeBlog(blog.id, user.token, blog)
    onLiked()
  }

  const handleRemove = async () => {
    const response = window.confirm(`Are you sure you want to delete ${blog.title}?`)
    if (!response) return
    await blogService.deleteBlog(blog.id, user.token)
    onRemove()
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button type='button' onClick={handleViewOrHide}>{isDetailsVisible ? 'hide' : 'view'}</button>
      </div>
      {isDetailsVisible && <BlogDetails onClick={handleRemove} isRemoveVisible={isRemoveVisible} />}
    </div>
  )
}

export default Blog