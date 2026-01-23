import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/notify";
import Recommend from "./components/recommend";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";

const App = () => {
  const user = localStorage.getItem("login-token");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const client = useApolloClient();

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 10000);
  };

  const logout = () => {
    localStorage.clear();
    client.resetStore();
    navigate("/");
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => navigate("/authors")}>authors</button>
        <button onClick={() => navigate("/books")}>books</button>
        {user && <button onClick={() => navigate("/add")}>add book</button>}
        {!user && <button onClick={() => navigate("/login")}>Login</button>}
        {user && (
          <button onClick={() => navigate("/recommend")}>Recommend</button>
        )}
        {user && <button onClick={logout}>Logout</button>}
      </div>
      <Routes>
        <Route
          path="/authors"
          element={<Authors setError={setError} />}
        ></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/add" element={<NewBook setError={setError} />}></Route>
        <Route path="/login" element={<Login setError={setError} />}></Route>
        <Route
          path="/recommend"
          element={<Recommend setError={setError} />}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
