import logo from "./logo.svg";

import "./App.css";
import React, { useEffect, useState } from "react";
const axios = require("axios");
const builder = require("xmlbuilder");

function App() {
  const [isLoaded, toggleLoaded] = useState(false);
  const [JWT, setJWT] = useState({});
  const [DDCOutcomeLogged, toggleDDCOutcomeLogged] = useState(false);
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
  function buildXml(options) {
    var root = builder.create("root", {
      stringify: {
        attValue: function (str) {
          return str.replace(/"/g, "'");
        },
      },
    });
    //prettier-ignore
    var xml = builder
      .create("paymentService", { version: '1.0', encoding: "UTF-8" })
      .att("version", 1.4)
      .att("merchantCode", "TRISTANTEST")
      .ele("submit")
      .ele("order", {
        orderCode: generateRandomString(12),
      })
      .ele("description", {}, "Order created at: 23h982y9h9")
      .up()
      .ele("amount", {
        value: 1000,
        currencyCode: "USD",
        exponent: 0,
      })
      .up()
      .ele("orderContent")
      .dat("thisis-cdata-content-asiwantittobe")
      .up()
      .ele("paymentDetails")
      .ele("cardNumber", {}, 4000000000001000)
      .up()
      .ele("expiryDate")
      .ele("date", {
        month: "01",
        year: "2024",
      })
      .up()
      .up()
      .ele("cardHolderName", {}, "AUTHORIZED")
      .up()
      .ele("cvc", {}, 555)
      .up()
      .end();

    var doctype = `<!DOCTYPE paymentService PUBLIC '-//WorldPay//DTD WorldPay PaymentService v1//EN' 'http://dtd.worldpay.com/paymentService_v1.dtd'>`;

    xml = xml.substring(0, 38) + doctype + xml.substring(38, xml.length);

    return xml;
  }

  // document
  //   .querySelector("iframe")
  //   .contentWindow.document.addEventListener("load", e => {
  //     setTimeout(() => {
  //       console.log("running");
  //       document.getElementById("collectionForm").submit();
  //       return false;
  //     }, 1000);
  //   });
  window.addEventListener("load", function (e) {
    document.getElementById("collectionForm").submit();
  });

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

  async function handleSubmit(e) {
    e.preventDefault();
    const JWT = e.target[1].value;
    const Bin = e.target[0].value;
    fetch("https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect", {
      method: "POST",
      body: JSON.stringify({ Bin, JWT }),
    }).then(res => console.log(res));
  }

  useEffect(() => {
    getJWT();
  }, [DDCOutcomeLogged]);

  window.addEventListener(
    "message",
    async function (event) {
      //This is a Cardinal Commerce URL in live.
      if (event.origin === "https://centinelapistag.cardinalcommerce.com") {
        const data = JSON.parse(event.data);
        if (data !== undefined && data.Status) {
          if (!DDCOutcomeLogged) {
            document.getElementById(
              "DDC-outcome"
            ).innerText = `Session ID received from Cardinal after device data collection (DDC): ${data.SessionId}`;

            toggleDDCOutcomeLogged(true);
          }
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
          <cardHolderName>AUTHORISED</cardHolderName>
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
        dfReferenceId='${data.SessionId}'
        challengeWindowSize='390x400'
        challengePreference='challengeMandated'/>
    </order>
  </submit>
</paymentService>`;
          authRequest[0].trim().replace("^([\\W]+)<", "<");

          const config = {
            headers: { "Content-Type": "text/xml", Charset: "UTF-8" },
            request: authRequest,
          };
          const authRes = await axios.post(
            "http://localhost:3001/auth-request",
            config
          );
          document.body.append(authRes.data);
          console.log(`res from auth request is ${authRes.data}`);
        }
      }
    },
    false
  );

  return (
    <div className="App">
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
          method="POST"
          action="https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect"
          target="myiframe"
        >
          <input type="hidden" name="Bin" value="4000000000001000" />
          <input type="hidden" name="JWT" value={JWT} />
        </form>
      </iframe>

      <h5 id="DDC-outcome">Hi there</h5>
      <div height="300" width="300">
        <br></br>
        <form
          id="challengeForm"
          method="POST"
          action="https://centinelapistag.cardinalcommerce.com/V2/Cruise/StepUp"
        >
          <input
            type="text"
            name="JWT"
            value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZGE3MDVlMS01ZmEzLTQyMTMtOTcxNC00OTMyNmZkNWJhZWUiLCJpYXQiOjE2MzQ4ODI2MjIsImlzcyI6IjViZDllMGU0NDQ0ZGNlMTUzNDI4Yzk0MCIsImV4cCI6MTYzNDg4NjIyMiwiT3JnVW5pdElkIjoiZmEyZGFlZTItMWZiYi00NWZmLTQ0NDQtNTI4MDVkNWNkOWUwIiwiUmV0dXJuVXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiUGF5bG9hZCI6eyJQYXlsb2FkIjoiZXlKdFpYTnpZV2RsVkhsd1pTSTZJa05TWlhFaUxDSnRaWE56WVdkbFZtVnljMmx2YmlJNklqSXVNUzR3SWl3aWRHaHlaV1ZFVTFObGNuWmxjbFJ5WVc1elNVUWlPaUk0WmpCbVlqTm1aaTAyWXpNekxUUXdaVFl0WVRSaFpTMWtPVGcwTWpRelltUmhNVFFpTENKaFkzTlVjbUZ1YzBsRUlqb2lOVGt4WmpKaFpEWXRPVFJpWkMwMFpXVXpMVGcwWWpZdFpEQm1aamMxTVRZMk4yRmpJaXdpWTJoaGJHeGxibWRsVjJsdVpHOTNVMmw2WlNJNklqQXlJbjAiLCJBQ1NVcmwiOiJodHRwczovLzBtZXJjaGFudGFjc3N0YWcuY2FyZGluYWxjb21tZXJjZS5jb20vTWVyY2hhbnRBQ1NXZWIvY3JlcS5qc3AiLCJUcmFuc2FjdGlvbklkIjoiMXQwNlZDTWo4TFNPWWdEeGtwejAifSwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZX0.PRcBFZJS2sWBazLejF1eY023_QnGmnL7KHYTK8gkOQQ"
          />
          <input type="text" name="MD" value="1234567890" />
          <button>submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
