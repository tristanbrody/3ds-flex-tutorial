import { useContext } from "react";
import { AppContext } from "../../App";
import classes from "./Logger.module.css";

const Logger = () => {
  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);
  const toReturn = (
    <div className={classes.loggerContainer}>
      <div className={classes.loggerContent}>
        <div className={classes.loggerBox}>
          <h4>Variables</h4>
          <ul>
            {Object.entries(APP_STORE)
              .filter(k => k[0] !== "scenario")
              .map(k => {
                return (
                  <li>
                    <strong>{k[0]}</strong>: {k[1]}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
  console.log("pause");
  return toReturn;
};

export default Logger;
