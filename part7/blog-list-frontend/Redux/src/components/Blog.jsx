import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlogs, likeBlogs } from "../reducers/blogReducer";

const Blog = ({ blog }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isRemoveVisible, setIsRemoveVisible] = useState(true);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!blog) return;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const BlogDetails = ({ onClick, isRemoveVisible }) => (
    <div>
      <div>{blog.url}</div>
      <div className="likes">
        {blog.likes}
        <button type="button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>{blog.author}</div>
      <div>{blog.user?.name}</div>
      {isRemoveVisible ? (
        <button type="button" onClick={onClick}>
          remove
        </button>
      ) : null}
    </div>
  );

  const handleViewOrHide = () => setIsDetailsVisible(!isDetailsVisible);

  const handleLike = async () => {
    dispatch(likeBlogs(blog.id, user.token, blog));
  };

  const handleRemove = async () => {
    const response = window.confirm(
      `Are you sure you want to delete ${blog.title}?`,
    );
    if (!response) return;
    dispatch(deleteBlogs(blog.id, user.token));
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button type="button" onClick={handleViewOrHide}>
          {isDetailsVisible ? "hide" : "view"}
        </button>
      </div>
      {isDetailsVisible && (
        <BlogDetails onClick={handleRemove} isRemoveVisible={isRemoveVisible} />
      )}
    </div>
  );
};

export default Blog;
