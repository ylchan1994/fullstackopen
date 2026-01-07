import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { List, ListItemButton, ListItemText } from "@mui/material";

const UserView = () => {
  const userId = useParams().id;
  const queryClient = useQueryClient();
  const blogs = queryClient
    .getQueryData(["blogs"])
    .filter((blog) => userId == blog.user.id);
  const userName = blogs[0].user.name;

  if (!blogs) return;

  return (
    <div>
      <h2>{userName}</h2>
      <h3>added blogs</h3>
      <List>
        {blogs.map((blog) => (
          <ListItemButton key={blog.id} href={`/blogs/${blog.id}`}>
            <ListItemText>
              {blog.title} {blog.author}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default UserView;
