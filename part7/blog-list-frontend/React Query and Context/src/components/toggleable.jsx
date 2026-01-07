import { Button } from "@mui/material";
import { useImperativeHandle, useState } from "react";

const Toggleable = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  //const showWhenVisible = { display: isVisible ? '' : 'none' }
  const showWhenNotVisible = { display: isVisible ? "none" : "" };

  const toggleVisibility = () => setIsVisible(!isVisible);

  useImperativeHandle(props.ref, () => {
    return toggleVisibility;
  });

  return (
    <div>
      {!isVisible && (
        <Button
          onClick={toggleVisibility}
          style={showWhenNotVisible}
          type="click"
          variant="contained"
          color="primary"
        >
          {props.buttonLabel}
        </Button>
      )}
      {isVisible && <div>{props.children}</div>}
    </div>
  );
};

export default Toggleable;
