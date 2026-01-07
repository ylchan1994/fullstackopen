import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeBlog, updateBlogComment } from "../request/blogs";
import UserContext from "../context/userContext";
import { useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const BlogDetails = () => {
  const [comment, setComment] = useState("");
  const blogId = useParams().id;
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const blog = queryClient
    .getQueryData(["blogs"])
    .filter((blog) => blog.id == blogId)[0];

  const likeBlogMutation = useMutation({
    mutationFn: likeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const updateBlogCommentMutation = useMutation({
    mutationFn: updateBlogComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setComment("");
    },
  });

  const handleLike = async () => {
    likeBlogMutation.mutate({ id: blog.id, token: user.token, blog });
  };

  const updateComment = async (e) => {
    e.preventDefault();

    if (!comment) return;

    updateBlogCommentMutation.mutate({
      id: blogId,
      token: user.token,
      comment,
    });
  };

  if (!blog) return;

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url} target="blank">
          {blog.url}
        </a>
      </div>
      <div className="likes">
        {blog.likes}
        <button type="button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>{blog.author}</div>
      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></TextField>
      <div>
        <Button
          onClick={updateComment}
          type="submit"
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </div>
      {blog.comments && (
        <div>
          <h3>Comments</h3>

          <ul>
            {blog.comments.map((comment) => (
              <li>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
