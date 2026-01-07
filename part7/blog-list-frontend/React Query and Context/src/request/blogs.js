import axios from "axios";
const baseUrl = "/api/blog-list";

export const getAll = async () => {
  const response = await axios.get(baseUrl);
  const blogs = response.data;
  blogs.sort((a, b) => b.likes - a.likes);
  return blogs;
};

export const createBlog = async ({ token, blog }) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const request = await axios.post(baseUrl, blog, additionalHeaders);
  return request.data;
};

export const likeBlog = async ({ id, token, blog }) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const newLikes = { likes: blog.likes + 1 };
  const request = await axios.put(
    `${baseUrl}/${id}`,
    newLikes,
    additionalHeaders,
  );
  return request.data;
};

export const updateBlogComment = async ({ id, token, comment }) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const comments = { comment };
  const request = await axios.put(
    `${baseUrl}/${id}`,
    comments,
    additionalHeaders,
  );
  return request.data;
};

export const deleteBlog = async ({ id, token }) => {
  const additionalHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const request = await axios.delete(`${baseUrl}/${id}`, additionalHeaders);
  return request.data;
};
