import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ requestBlog }) => {
  const [blog, setBlog] = useState({});

  useEffect(() => {
    setBlog(requestBlog);
  });

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    </div>
  );
};

export default Blog;
