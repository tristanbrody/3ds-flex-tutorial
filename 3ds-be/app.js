const express = require("express");
const router = new express.Router();
const app = express();
const xmlParser = require("express-xml-bodyparser");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const JWT_OPTIONS = {};

app.use(xmlParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

router.post("/token", (req, res) => {
  const jti = uuid();
  const iat = Math.floor(new Date().getTime() / 1000);
  const exp = Math.floor(new Date().addHours(1) / 1000);
  const iss = "61654c80424ec551b72be555";
  const OrgUnitId = "61654c80424ec551b72be554";
  const MAC = "55dd3cbe-23a6-456a-84dc-71cdfe5ff0b8";

  const payload = {
    jti,
    iat,
    iss,
    exp,
    OrgUnitId,
  };

  const token = jwt.sign(payload, MAC, JWT_OPTIONS);
  return res.json({ token });
});

router.get("/token2", (req, res) => {
  const jti = uuid();
  const iat = Math.floor(new Date().getTime() / 1000);
  const exp = Math.floor(new Date().addHours(1) / 1000);
  const iss = process.env.ISS;
  const OrgUnitId = process.env.ORG_UNIT_ID;
  const ReturnUrl = "http://localhost:3000";
  const MAC = process.env.MAC;
  const Payload = {
    Payload:
      "eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI4ZjBmYjNmZi02YzMzLTQwZTYtYTRhZS1kOTg0MjQzYmRhMTQiLCJhY3NUcmFuc0lEIjoiNTkxZjJhZDYtOTRiZC00ZWUzLTg0YjYtZDBmZjc1MTY2N2FjIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0",
    ACSUrl:
      "https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp",
    TransactionId: "1t06VCMj8LSOYgDxkpz0",
  };

  const payload = {
    jti,
    iat,
    iss,
    exp,
    OrgUnitId,
    ReturnUrl,
    Payload,
    ObjectifyPayload: true,
  };
  const token = jwt.sign(payload, MAC, {});
  return res.json({ token });
});

router.get("/", (req, res) => {
  return res.json({ res: "something" });
});

router.post("/auth-request", async (req, res) => {
  debugger;
  const config = {
    headers: { "Content-Type": "text/xml", Charset: "UTF-8" },
  };
  return axios
    .post(
      "https://secure-test.worldpay.com/jsp/merchant/xml/paymentService.jsp",
      req.body.request,
      {
        auth: {
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
      }
    )
    .then(res => {
      console.log(res.data);
    });
});

app.use(router);
app.use((req, res) => {
  res.status(404).json({
    someBody: "Route not found or missing resource.....",
  });
});

module.exports = app;
