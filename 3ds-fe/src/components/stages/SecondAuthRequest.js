import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./SecondAuthRequest.module.css";
import { AppContext } from "../../App";
import StageToggle from "../../UI/StageToggle";
const parseXML = require("xml2js").parseString;
const axios = require("axios");

const SecondAuthRequest = () => {
  const secondAuthRequestContainer = useRef(null);
  const navigate = useNavigate();

  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);
  useEffect(() => {
    const postSecondAuthRequest = async () => {
      const secondAuthRequestXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE paymentService PUBLIC "-//Worldpay//DTD Worldpay PaymentService v1//EN" "http://dtd.worldpay.com/paymentService_v1.dtd" >
<paymentService version="1.4" merchantCode="TRISTANTEST">  
  <submit>
    <order orderCode='${APP_STORE.OrderCode}'> <!--The order code supplied in the first request-->
      <info3DSecure>
        <completedAuthentication/>
      </info3DSecure>
      <session id='${APP_STORE.OrderSessionId}'/> <!--The session id supplied in the first request-->
    </order>
  </submit>
</paymentService>`;
      secondAuthRequestXml[0].trim().replace("^([\\W]+)<", "<");

      const config = {
        headers: { "Content-Type": "text/xml", Charset: "UTF-8" },
        request: { xml: secondAuthRequestXml, cookie: APP_STORE.cookie },
      };
      const authRes = await axios.post(
        "http://localhost:3001/second-auth-request",
        config
      );
      var data = authRes.data.res.toString().replace("\ufeff", "");

      parseXML(data, (err, res) => {
        if (err) throw err;
        secondAuthRequestContainer.current.innerText = `
        XML sent to Worldpay: ${secondAuthRequestXml}
        XML received from Worldpay: ${data}
        `;
        console.dir(res.paymentService.reply[0]);
        const status =
          res.paymentService.reply[0].orderStatus[0].payment[0].lastEvent[0];
        // const acsURL =
        //   res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
        //     .threeDSChallengeDetails[0].acsURL[0];
        // const payload =
        //   res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
        //     .threeDSChallengeDetails[0].payload[0];

        UPDATE_APP_STORE(prev => {
          return {
            ...prev,
            status,
          };
        });
      });
    };
    postSecondAuthRequest();
  }, []);

  useEffect(() => {
    let statusText = APP_STORE.status !== undefined ? APP_STORE.status : "...";
  }, [APP_STORE.status]);
  return (
    <>
      <div
        class={classes.secondAuthRequestContainer}
        ref={secondAuthRequestContainer}
      >
        Second auth request
      </div>
      <StageToggle forwardDisabled={true} prevDisabled={true} />
    </>
  );
};

export default SecondAuthRequest;
