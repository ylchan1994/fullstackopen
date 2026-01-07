import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const BlogSummary = () => {
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueryData(["blogs"]);

  if (!blogs) return;

  const blogsSummary = {};
  blogs.forEach((blog) => {
    const { user } = blog;
    const { id, name } = user;
    const exist = blogsSummary[id];
    blogsSummary[id] = exist ?? {};
    blogsSummary[id]["count"] = !exist ? 1 : exist.count + 1;
    blogsSummary[id]["name"] = blogsSummary[id]["name"] ?? name;
  });

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(blogsSummary).map((id) => {
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Link to={`/users/${id}`}>{blogsSummary[id]["name"]}</Link>
                  </TableCell>
                  <TableCell>{blogsSummary[id]["count"]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogSummary;
