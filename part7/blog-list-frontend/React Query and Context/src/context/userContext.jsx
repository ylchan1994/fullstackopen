import { createContext, useReducer } from "react";

const defaultUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : "";

const userReducer = (state, action) => {
  console.log(state, action, defaultUser);
  switch (action.type) {
    case "SET":
      return action.payload;
    case "RESET":
      return "";
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, defaultUser);

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
