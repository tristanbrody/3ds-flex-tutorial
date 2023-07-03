import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StageToggle from "../../UI/StageToggle";
import { AppContext } from "../../App";
const axios = require("axios");

const Challenge = () => {
  const navigate = useNavigate();
  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);
  const challengeHeader = useRef(null);
  const challengeForm = useRef(null);
  const challengeFrame = useRef(null);
  const [challengeCompleted, toggleChallengeCompleted] = useState(false);
  useEffect(() => {
    const getSecondChallengeJWT = async () => {
      const challengeJWT = await fetch("http://localhost:3001/token2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          Payload: APP_STORE.payload,
          acsURL: APP_STORE.acsURL,
          TransactionId: APP_STORE.transactionId3DS,
        }),
      }).then(res => res.json());
      UPDATE_APP_STORE(prev => {
        return { ...prev, challengeJWT: challengeJWT.token };
      });
    };
    getSecondChallengeJWT();
  }, []);

  useEffect(() => {
    if (APP_STORE.challengeJWT !== undefined) {
      challengeHeader.current.innerHTML =
        "Submitting challenge JWT to Cardinal...";
      console.log(`curr value for challengeJWT is ${APP_STORE.challengeJWT}`);
      challengeForm.current.submit();
      setTimeout(() => {
        challengeFrame.current.style.width = "1000px";
        challengeFrame.current.style.height = "800px";
        challengeFrame.current.style.display = "initial";
        challengeHeader.current.innerHTML =
          "Simulated response challenge from Cardinal below...";
      }, 5000);
    }
  }, [APP_STORE.challengeJWT]);

  window.addEventListener(
    "message",
    async function (event) {
      const data = event.data;
      if (data === "Challenge completed") {
        console.log(`Challenge completed`);
        toggleChallengeCompleted(true);
      }
    },
    false
  );
  return (
    <div>
      <h4 ref={challengeHeader}></h4>
      <iframe
        height="390"
        width="400"
        id="myiframe"
        name="myiframe"
        ref={challengeFrame}
        height="1"
        width="1"
        style={{ display: "none" }}
        title="sometitle"
      >
        <form
          ref={challengeForm}
          id="challengeForm"
          method="POST"
          action="https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp"
          target="myiframe"
        >
          <input type="hidden" name="JWT" value={APP_STORE.challengeJWT} />
          <button>submit</button>
        </form>
      </iframe>
      <StageToggle
        prevLink="#"
        forwardLink="/second-auth-request"
        forwardDisabled={!challengeCompleted}
      />
    </div>
  );
};

export default Challenge;
