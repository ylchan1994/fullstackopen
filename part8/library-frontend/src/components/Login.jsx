import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setError }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("login-token", data.login.value);
      navigate("/");
    },
    onError: (error) => setError(error.message),
  });

  const login = async (e) => {
    e.preventDefault();
    await loginMutation({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={login}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
