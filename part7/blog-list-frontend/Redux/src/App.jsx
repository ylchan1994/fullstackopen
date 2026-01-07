import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import UserInfo from "./components/user-info";
import NewBlog from "./components/new-blog";
import LoginForm from "./components/login-form";
import FloatingMessage from "./components/floating-message";
import Toggleable from "./components/toggleable";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";

const App = () => {
  const newBlogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const handleCancelNewBlog = (e) => {
    e.preventDefault();
    newBlogFormRef.current();
  };

  useEffect(() => {
    dispatch(getAllBlogs());

    if (localStorage.getItem("user") !== "") {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      dispatch(setUser(loggedInUser));
    }
  }, []);

  return (
    <div>
      <h2>blogs</h2>
      <FloatingMessage />

      {!user && <LoginForm></LoginForm>}

      {user && (
        <div>
          <UserInfo></UserInfo>
          <Toggleable ref={newBlogFormRef} buttonLabel="create new blog">
            <NewBlog onCancel={handleCancelNewBlog}></NewBlog>
          </Toggleable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
