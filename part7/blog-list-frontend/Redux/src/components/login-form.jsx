import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useState } from "react";
import loginService from "../services/login";
import { getAllBlogs } from "../reducers/blogReducer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await loginService.userLogin(username, password);
      dispatch(setUser(loggedUser));
      localStorage.setItem("user", JSON.stringify(loggedUser));
    } catch (error) {
      console.log(error.message);
      dispatch(
        setNotification({
          message: "wrong username or password",
          style: "fail",
        }),
      );
      setTimeout(
        () =>
          dispatch(
            setNotification({
              message: null,
              style: null,
            }),
          ),
        5000,
      );
    }

    dispatch(getAllBlogs());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
