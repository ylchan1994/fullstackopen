import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Button color="secondary" component={Link} to="/">
            Home
          </Button>
          <Button color="secondary" component={Link} to="/blogs">
            Blogs
          </Button>
          <Button color="secondary" component={Link} to="/users">
            Users
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
