import { useEffect, useContext, useRef, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import StageToggle from "../../UI/StageToggle";

import classes from "./InitialAuthRequest.module.css";
const util = require("util");

const axios = require("axios");
const parseXML = require("xml2js").parseString;

const InitialAuthRequest = () => {
  const [forwardDisabled, setForwardDisabled] = useState(false);
  const initialAuthContainer = useRef(null);
  const [dataLogged, setDataLogged] = useState(false);

  const navigate = useNavigate();

  const { APP_STORE, UPDATE_APP_STORE } = useContext(AppContext);

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
  useEffect(() => {
    initialAuthContainer.current.innerHTML =
      "Submitting initial auth request...";
    const submitInitialAuth = async () => {
      console.log(
        `sending card number in initial auth of ${APP_STORE.scenario.cardNumber}`
      );
      const randString1 = generateRandomString(8);
      const randString2 = generateRandomString(8);
      const authRequest = `<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE paymentService PUBLIC '-//Worldpay//DTD Worldpay PaymentService v1//EN' 'http://dtd.worldpay.com/paymentService_v1.dtd'>
<paymentService version='1.4' merchantCode='TRISTANTEST'>
  <submit>
    <order orderCode='testorder-${randString1}'>
      <description>YOUR DESCRIPTION</description>
      <amount value='2000' currencyCode='EUR' exponent='2'/>
      <orderContent>
      </orderContent>
      <paymentDetails>
        <CARD-SSL>
          <cardNumber>4000000000001109</cardNumber>
          <expiryDate>
            <date month='01' year='2024'/>
          </expiryDate>
          <cardHolderName>MILTON</cardHolderName>
          <cvc>123</cvc>
          <cardAddress>
            <address>
              <address1>Worldpay</address1>
              <address2>270-289 The Science Park</address2>
              <address3>Milton Road</address3>
              <postalCode>CB4 0WE</postalCode>
              <city>Cambridge</city>
              <countryCode>GB</countryCode>
            </address>
          </cardAddress>
        </CARD-SSL>
        <session shopperIPAddress='127.0.0.1' id='${randString2}'/> <!--Session id must be unique -->
      </paymentDetails>
      <shopper>
        <shopperEmailAddress>jshopper@myprovider.com</shopperEmailAddress>
        <browser>
          <acceptHeader>text/html</acceptHeader>
          <userAgentHeader>Mozilla/5.0 ...</userAgentHeader>
        </browser>
      </shopper>
      <!-- Additional 3DS data that you must provide to us -->
      <additional3DSData
        dfReferenceId='${APP_STORE.SessionId}'/>
    </order>
  </submit>
</paymentService>`;
      authRequest[0].trim().replace("^([\\W]+)<", "<");

      const config = {
        headers: { "Content-Type": "text/xml", Charset: "UTF-8" },
        request: authRequest,
      };
      let authRes;
      try {
        authRes = await axios.post(
          "http://localhost:3001/auth-request",
          config
        );
      } catch {
        console.log("ERROR WITH TRANSACTION");
      }
      let data = authRes.data.res.toString().replace("\ufeff", "");

      parseXML(data, (err, res) => {
        if (err) throw err;
        if (APP_STORE.scenario.scenario !== "successful-frictionless") {
          initialAuthContainer.current.innerText = `Response from Worldpay to initial auth is ${data}`;
          try {
            const initialAuthReply = res.paymentService.reply[0];
            const transactionId3DS =
              res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
                .threeDSChallengeDetails[0].transactionId3DS[0];
            const acsURL =
              res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
                .threeDSChallengeDetails[0].acsURL[0];
            const payload =
              res.paymentService.reply[0].orderStatus[0].challengeRequired[0]
                .threeDSChallengeDetails[0].payload[0];

            UPDATE_APP_STORE(prev => {
              return {
                ...prev,
                transactionId3DS,
                acsURL,
                payload,
                cookie: authRes.data.cookie,
                OrderCode: `testorder-${randString1}`,
                OrderSessionId: randString2,
                initialAuthReply: JSON.stringify(initialAuthReply),
              };
            });
          } catch {
            //
          }
        } else {
          initialAuthContainer.current.innerText = `Response from Worldpay to initial auth is ${data}`;
          setForwardDisabled(true);
        }
      });

      // setTimeout(() => navigate("/challenge"), 5000);
      return null;
    };
    submitInitialAuth();
  }, []);

  useEffect(() => {
    if (!dataLogged && APP_STORE.transactionId3DS !== undefined) {
      setDataLogged(true);
    }
  }, [APP_STORE.transactionId3DS]);
  return (
    <div className={classes.initialAuthContainer}>
      <p ref={initialAuthContainer}></p>
      <StageToggle
        prevLink="#"
        forwardLink="/challenge"
        forwardDisabled={forwardDisabled}
      />
    </div>
  );
};

export default InitialAuthRequest;
