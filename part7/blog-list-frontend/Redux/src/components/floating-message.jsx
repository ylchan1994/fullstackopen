import { useSelector } from "react-redux";

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
  const { message, style } = useSelector((state) => state.notifications);
  return (
    <div>
      {message && (
        <p
          style={style === "success" ? successStyle : errorStyle}
          className="floating-message"
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default FloatingMessage;
