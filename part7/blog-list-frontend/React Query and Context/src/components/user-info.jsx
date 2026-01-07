import { useContext } from "react";
import UserContext from "../context/userContext";
import { Button } from "@mui/material";

const UserInfo = () => {
  const { user, userDispatch } = useContext(UserContext);

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.setItem("user", "");
    userDispatch({ type: "RESET" });
  };

  return (
    <div>
      {`${user.name} logged in`}
      <Button
        type="submit"
        variant="contained"
        color="tertiary"
        onClick={handleLogout}
      >
        logout
      </Button>
    </div>
  );
};

export default UserInfo;
