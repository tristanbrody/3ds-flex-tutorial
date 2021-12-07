import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../App";
import styles from "./InitialAuthRequest.module.css";
const parseXML = require("xml2js").parseString;
const axios = require("axios");

const SecondAuthRequest = () => {
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
        // const transactionId3DS =
        //   res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
        //     .threeDSChallengeDetails[0].transactionId3DS[0];
        // const acsURL =
        //   res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
        //     .threeDSChallengeDetails[0].acsURL[0];
        // const payload =
        //   res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
        //     .threeDSChallengeDetails[0].payload[0];

        // UPDATE_APP_STORE(prev => {
        //   return {
        //     ...prev,
        //     transactionId3DS,
        //     acsURL,
        //     payload,
        //     cookie: authRes.data.cookie,
        //     OrderCode: randString1,
        //     OrderSessionId: randString2,
        //   };
        // });
      });
    };
    postSecondAuthRequest();
  }, []);
  return <div>Second auth request</div>;
};

export default SecondAuthRequest;
