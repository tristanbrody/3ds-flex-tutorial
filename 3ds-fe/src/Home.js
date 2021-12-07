import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserConfigurationForm from "./UserConfigurationForm";
import { AppContext } from "./App";
import Card from "./UI/Card";

const Home = () => {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState({
    type: "successful",
    withChallenge: true,
    scenario: "default",
  });

  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);

  const handleConfigSubmit = e => {
    setScenario(prevVal => {
      return { ...prevVal, scenario: e.target.value };
    });
    const savedScenario = {};
    UPDATE_APP_STORE(prev => {
      return {
        ...prev,
        scenario,
      };
    });
    navigate("/ddc-collection");
  };
  return (
    <Card>
      <UserConfigurationForm handleConfigSubmit={handleConfigSubmit} />
    </Card>
  );
};

export default Home;
