import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DDC_Stage from "../stages/DDC_Stage";
import InitialAuthRequest from "../stages/InitialAuthRequest";
import StageToggle from "../../UI/StageToggle";

const ChallengeRequiredFlow = () => {
  // piece of state to store the full sequence of routes visited for the flow
  const [flow, _] = useState(["/ddc-collection", "/initial-auth-request"]);

  const [currentStage, setCurrentStage] = useState(0);

  const [farthestStage, setFarthestStage] = useState(0);

  const updateStage = direction => {
    console.log("update stage running");
    //function passed to each stage component to update to the appropriate route

    //make sure operation is within bounds of array for flow
    if (currentStage === flow.length - 1 && direction === "forward") return;
    if (currentStage === 0 && direction === "backward") return;
    if (direction === "forward") setCurrentStage(prev => prev + 1);
    if (direction === "backward") setCurrentStage(prev => prev - 1);
  };
  const navigate = useNavigate();
  console.log(flow[currentStage] === "/ddc-collection");
  switch (flow[currentStage]) {
    case "/ddc-collection":
      return (
        <div>
          <DDC_Stage updateStage={updateStage} />
          <StageToggle />
        </div>
      );
    case "/initial-auth-request":
      navigate("/initial-auth-request");
      return null;
    default:
      return <div>Shit</div>;
  }
};

export default ChallengeRequiredFlow;
