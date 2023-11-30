import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Construct from "./Construct.js";
// import ErrorNotification from "./ErrorNotification";
import "./App.css";
import Login from "./Login"
import Homepage from "./Homepage"
import Dashboard from "./Dashboard"

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <main>
        <Homepage />
        {/* <Login /> */}
        {/* Other Components */}
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;


  // return code ? <Dashboard code={code} /> : <Login />
