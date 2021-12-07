import classes from "./Button.module.css";

const Button = ({ buttonText }) => {
  return (
    <button className={classes.button} type="submit">
      {buttonText}
    </button>
  );
};

export default Button;
