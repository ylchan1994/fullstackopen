import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/userReducer";

const UserInfo = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = async (e) => {
    e.preventDefault();
    dispatch(setUser(""));
    localStorage.setItem("user", "");
  };

  return (
    <div>
      {`${user.name} logged in`}
      <button type="submit" onClick={onLogout}>
        logout
      </button>
    </div>
  );
};

export default UserInfo;
