import logo from "./logo.svg";

import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import DDC_Stage from "./components/stages/DDC_Stage";
import ChallengeRequiredFlow from "./components/flows/ChallengeRequiredFlow";
import Home from "./Home";
import InitialAuthRequest from "./components/stages/InitialAuthRequest";
import Challenge from "./components/stages/Challenge";
import SecondAuthRequest from "./components/stages/SecondAuthRequest";
import Logger from "./components/logger/Logger";
export const AppContext = createContext();

function App() {
  const [APP_STORE, UPDATE_APP_STORE] = useState({});

  return (
    <AppContext.Provider value={{ APP_STORE, UPDATE_APP_STORE }}>
      <div style={{ display: "flex", height: "100vh" }} className="App">
        <div class="outputContainer" style={{ display: "flex" }}></div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/ddc-collection" element={<DDC_Stage />} />
            <Route
              exact
              path="/initial-auth-request"
              element={<InitialAuthRequest />}
            />
            <Route exact path="/challenge" element={<Challenge />} />
            <Route
              exact
              path="/second-auth-request"
              element={<SecondAuthRequest />}
            />
          </Routes>
        </BrowserRouter>
        <Logger />
      </div>
    </AppContext.Provider>
  );
}

export default App;
