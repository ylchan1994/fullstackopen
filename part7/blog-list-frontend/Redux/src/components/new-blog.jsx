import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { createBlogs, getAllBlogs } from "../reducers/blogReducer";

const NewBlog = ({ onCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const createNewBlog = async (blog) => {
    dispatch(createBlogs(user.token, blog));
    dispatch(
      setNotification({
        message: `a new blog ${blog.title} by ${blog.author} added`,
        style: "success",
      }),
    );
    setTimeout(
      () =>
        dispatch(
          setNotification({
            message: null,
            style: null,
          }),
        ),
      5000,
    );

    dispatch(getAllBlogs());
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    const blog = {
      title,
      author,
      url,
    };
    createNewBlog(blog);
    resetNewBlogInput();
  };

  const resetNewBlogInput = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleCreateBlog}>
      <h2>create new</h2>
      <div>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          ></input>
        </label>
      </div>
      <button type="submit">create</button>
      <button type="button" onClick={onCancel}>
        cancel
      </button>
    </form>
  );
};

export default NewBlog;
