import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserConfigurationForm from "./UserConfigurationForm";
import { AppContext } from "./App";
import Card from "./UI/Card";
import StageToggle from "./UI/StageToggle";

const Home = () => {
  // create class or set of classes to manage different scenarios, then instantiate them in App.js and pass into single UI component that can be re-rendered throughout app's cycle
  const navigate = useNavigate();
  const [scenario, setScenario] = useState({
    cardNumber: "4000000000001091",
    type: "successful",
    withChallenge: "true",
    scenario: "default-successful-with-challenge",
    cardHolderName: "AUTHORISED",
  });

  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);

  const handleConfigSubmit = e => {
    let selectedScenario = {};
    console.log(typeof e.target.elements[0].selectedOptions[0].value);
    switch (e.target.elements[0].selectedOptions[0].value) {
      case "4000000000001109":
        selectedScenario = {
          cardNumber: e.target.elements[0].selectedOptions[0].value,
          type: "failed",
          withChallenge: "true",
          scenario: "failed-step-up",
          cardHolderName: "REFUSED",
        };
        break;
      case "4000000000001000":
        selectedScenario = {
          cardNumber: e.target.elements[0].selectedOptions[0].value,
          type: "successful",
          withChallenge: "false",
          scenario: "successful-frictionless",
          cardHolderName: "AUTHORISED",
        };
        break;
      case "4000000000001034":
        selectedScenario = {
          cardNumber: e.target.elements[0].selectedOptions[0].value,
          type: "failed",
          withChallenge: "false",
          scenario: "attempts-non-participating",
          cardHolderName: "AUTHORISED",
        };
        break;
      case "4000000000001075":
        selectedScenario = {
          cardNumber: e.target.elements[0].selectedOptions[0].value,
          type: "failed",
          withChallenge: "false",
          scenario: "timeout",
          cardHolderName: "AUTHORISED",
        };
        break;
      default:
        selectedScenario = {
          cardNumber: "4000000000001091",
          type: "successful",
          withChallenge: "true",
          scenario: "default-successful-with-challenge",
          cardHolderName: "AUTHORISED",
        };
    }
    setScenario(prevVal => {
      return { ...prevVal, scenario: selectedScenario };
    });
    const savedScenario = {};
    UPDATE_APP_STORE(prev => {
      return {
        ...prev,
        scenario: selectedScenario,
      };
    });
    navigate("/ddc-collection");
  };
  return (
    <Card>
      <UserConfigurationForm handleConfigSubmit={handleConfigSubmit} />
      <StageToggle prevLink="#" forwardLink="#" forwardDisabled={true} />
    </Card>
  );
};

export default Home;
