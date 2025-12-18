import axios from 'axios'
const baseUrl = '/api/blog-list'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (token, blog) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const request = await axios.post(baseUrl, blog, additionalHeaders)
  return request.data
}

const likeBlog = async (id, token, blog) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const newLikes = { likes: blog.likes + 1 }
  const request = await axios.put(`${baseUrl}/${id}`, newLikes, additionalHeaders)
  return request.data
}

const deleteBlog = async (id, token) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const request = await axios.delete(`${baseUrl}/${id}`, additionalHeaders)
  return request.data
}

export default { getAll, createBlog, likeBlog, deleteBlog }