import { useContext } from "react";
import { useNavigate } from "react-router";
import classes from "./StageToggle.module.css";
import { AppContext } from "../App";

const StageToggle = ({
  forwardLink,
  prevLink,
  forwardDisabled = false,
  prevDisabled = true,
}) => {
  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);

  const navigate = useNavigate();
  const handleForwardClick = e => {
    e.preventDefault();
    navigate(forwardLink);
  };

  const handlePrevClick = e => {
    e.preventDefault();
    navigate(prevLink);
  };

  const handleReset = () => {
    UPDATE_APP_STORE({});
    navigate("/");
  };

  return (
    <div className={classes.buttonWrapper}>
      <button
        onClick={handlePrevClick}
        disabled={prevDisabled ? true : false}
        className={`${classes.prevButton} ${classes.button}`}
        href={prevLink}
      >
        Back
      </button>
      <button
        onClick={handleForwardClick}
        disabled={forwardDisabled ? true : false}
        className={`${classes.forwardButton} ${classes.button}`}
        href={forwardLink}
      >
        Forward
      </button>
      <button onClick={handleReset} className={classes.button}>
        Reset
      </button>
    </div>
  );
};

export default StageToggle;
