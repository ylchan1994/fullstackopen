import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlog(_state, action) {
      return action.payload;
    },
  },
});
const { setBlog } = blogSlice.actions;

export const getAllBlogs = () => {
  return async (dispatch) => {
    const newBlogs = await blogService.getAll();
    newBlogs.sort((a, b) => b.likes - a.likes);
    dispatch(setBlog(newBlogs));
  };
};

export const likeBlogs = (id, token, blog) => {
  return async (dispatch) => {
    await blogService.likeBlog(id, token, blog);
    dispatch(getAllBlogs());
  };
};

export const deleteBlogs = (id, token) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id, token);
    dispatch(getAllBlogs());
  };
};

export const createBlogs = (token, blog) => {
  return async (dispatch) => {
    await blogService.createBlog(token, blog);
    dispatch(getAllBlogs());
  };
};

export default blogSlice.reducer;
