import { useRef, useContext } from "react";
import Blog from "./components/Blog";
import UserInfo from "./components/user-info";
import NewBlog from "./components/new-blog";
import LoginForm from "./components/login-form";
import FloatingMessage from "./components/floating-message";
import Toggleable from "./components/toggleable";
import UserContext from "./context/userContext";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "./request/blogs";
import { Routes, Route } from "react-router-dom";
import BlogSummary from "./components/blog-summary";
import UserView from "./components/user-view";
import BlogDetails from "./components/blog-details";
import { Container } from "@mui/material";
import Navbar from "./components/navbar";

const App = () => {
  const { user } = useContext(UserContext);
  const newBlogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: getAll,
    refetchOnWindowFocus: false,
  });

  const refreshToggleable = async (blog) => {
    newBlogFormRef.current();
  };

  const blogs = result.data;
  if (result.isPending) return <p>Loading data...</p>;

  return (
    <>
      <Container>
        <Navbar />
        {user && <UserInfo />}
        <div>
          <h2>blogs app</h2>
          <FloatingMessage></FloatingMessage>
          {!user && <LoginForm></LoginForm>}
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {user && (
                  <>
                    <Toggleable
                      ref={newBlogFormRef}
                      buttonLabel="create new blog"
                    >
                      <NewBlog refreshToggleable={refreshToggleable}></NewBlog>
                    </Toggleable>
                  </>
                )}
              </div>
            }
          />
          <Route
            path="/blogs"
            element={
              user &&
              blogs.map((blog) => <Blog key={blog.id} requestBlog={blog} />)
            }
          />
          <Route path="/users" element={user && <BlogSummary />} />
          <Route path="/users/:id" element={user && <UserView />} />
          <Route path="/blogs/:id" element={user && <BlogDetails />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
