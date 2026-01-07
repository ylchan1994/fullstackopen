import { useContext } from "react";
import NotificationContext from "../context/notificationContext";
import { Alert } from "@mui/material";

const successStyle = {
  color: "green",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  borderColor: "green",
  padding: "10px",
  marginBottom: "10px",
};

const errorStyle = {
  color: "red",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  borderColor: "red",
  padding: "10px",
  marginBottom: "10px",
};

const FloatingMessage = () => {
  const { notification } = useContext(NotificationContext);
  const { message, style } = notification;
  return (
    <div>
      {message && (
        <Alert severity={style === "success" ? "success" : "error"}>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default FloatingMessage;
