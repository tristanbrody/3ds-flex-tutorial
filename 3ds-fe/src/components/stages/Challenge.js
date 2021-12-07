import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../App";
const axios = require("axios");

const Challenge = () => {
  const navigate = useNavigate();
  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);
  const challengeHeader = useRef(null);
  const challengeForm = useRef(null);
  const challengeFrame = useRef(null);
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
          "Simultated response challenge from Cardinal below...";
      }, 5000);
    }
    document.querySelector("iframe").addEventListener("load", e => {
      console.dir(challengeFrame.current);
      window.postMessage(JSON.stringify(window.location), "*");
    });
  }, [APP_STORE.challengeJWT]);

  window.addEventListener(
    "message",
    async function (event) {
      //This is a Cardinal Commerce URL in live.
      const data = event.data;
      console.log(event);
      if (data !== undefined) {
        console.log(`data is ${console.dir(data)}`);
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
    </div>
  );
};

export default Challenge;
