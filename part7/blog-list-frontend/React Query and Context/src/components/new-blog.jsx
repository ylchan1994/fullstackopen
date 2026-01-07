import { useContext, useState } from "react";
import { createBlog } from "../request/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserContext from "../context/userContext";
import NotificationContext from "../context/notificationContext";
import { TextField, Button } from "@mui/material";

const NewBlog = ({ refreshToggleable }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const { notificationDispatch } = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (_data, { blog }) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationDispatch({
        type: "SET",
        payload: {
          message: `a new blog ${blog.title} by ${blog.author} added`,
          style: "success",
        },
      });
      setTimeout(() => notificationDispatch({ type: "RESET" }), 5000);
    },
  });

  const handleCreateBlog = (e) => {
    e.preventDefault();
    const blog = {
      title,
      author,
      url,
    };
    newBlogMutation.mutate({ blog, token: user.token });
    resetNewBlogInput();
    refreshToggleable();
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
        <TextField
          label="Title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></TextField>
      </div>
      <div>
        <TextField
          label="Author"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        ></TextField>
      </div>
      <div>
        <TextField
          label="URL"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        ></TextField>
      </div>
      <Button type="click" variant="contained" color="primary">
        create
      </Button>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={refreshToggleable}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewBlog;
