import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../App";
const axios = require("axios");

const DDC_Stage = () => {
  const DDC_iFrame = useRef(null);
  const navigate = useNavigate();

  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);

  const [isLoaded, toggleLoaded] = useState(false);
  const [JWT, setJWT] = useState({});
  const [DDCOutcomeLogged, toggleDDCOutcomeLogged] = useState(false);
  const [DDCData, setDDCData] = useState("");
  const [authRequestCompleted, toggleAuthRequestCompleted] = useState(false);

  async function getJWT() {
    fetch("http://localhost:3001/token", { method: "POST" }).then(d =>
      d.json().then(res => {
        toggleLoaded(true);
        const token = res.token;
        setJWT(token);
      })
    );
  }

  function generateRandomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   const JWT = e.target[1].value;
  //   const Bin = e.target[0].value;
  //   fetch("https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect", {
  //     method: "POST",
  //     body: JSON.stringify({ Bin, JWT }),
  //   }).then(res => console.log(res));
  // }

  useEffect(() => {
    const getToken = async () => {
      await getJWT();
    };
    getToken();
  }, []);

  useEffect(() => {
    DDC_iFrame.current.submit();
    console.log("DDCOutcome is", DDCOutcomeLogged);
    if (DDCOutcomeLogged) {
      UPDATE_APP_STORE(prev => {
        return {
          ...prev,
          SessionId: DDCData.SessionId,
        };
      });
      navigate("/initial-auth-request");
      return null;
    }
  }, [JWT, DDCOutcomeLogged]);

  window.addEventListener(
    "message",
    async function (event) {
      //This is a Cardinal Commerce URL in live.
      if (event.origin === "https://centinelapistag.cardinalcommerce.com") {
        const data = JSON.parse(event.data);
        if (data !== undefined && data.Status) {
          setDDCData(data);
          toggleDDCOutcomeLogged(true);
        }
      }
    },
    false
  );

  return (
    <div>
      <iframe
        id="myiframe"
        name="myiframe"
        height="1"
        width="1"
        style={{ display: "none" }}
        title="sometitle"
      >
        <form
          id="collectionForm"
          ref={DDC_iFrame}
          method="POST"
          action="https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect"
          target="myiframe"
        >
          <input type="hidden" name="Bin" value="4000000000001000" />
          <input type="hidden" name="JWT" value={JWT} />
        </form>
      </iframe>

      <h5 id="DDC-outcome">Submitting device data collection...</h5>
      <div height="300" width="300">
        <br></br>
      </div>
    </div>
  );
};

export default DDC_Stage;
