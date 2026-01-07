import { useContext, useState } from "react";
import NotificationContext from "../context/notificationContext";
import UserContext from "../context/userContext";
import loginService from "../services/login";
import { Button, TextField } from "@mui/material";

const LoginForm = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { notificationDispatch } = useContext(NotificationContext);
  const { userDispatch } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await loginService.userLogin(user, password);
      userDispatch({ type: "SET", payload: loggedUser });
      localStorage.setItem("user", JSON.stringify(loggedUser));
    } catch (error) {
      console.log(error.message);
      notificationDispatch({
        type: "SET",
        payload: { message: "wrong username or password", style: "fail" },
      });
      setTimeout(() => notificationDispatch({ type: "RESET" }), 5000);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        ></TextField>
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
      </div>
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
