import React, { useEffect, useState } from "react";
// import Construct from "./Construct.js";
// import ErrorNotification from "./ErrorNotification";
import "./App.css";
import Login from "./Login"
import Dashboard from "./Dashboard"

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    <div className="App">
      <header>
        <h1>Audio Aesthetics</h1>
      </header>
      <main>
        <Login />
        {/* Other Components */}
      </main>
    </div>
  );
}

export default App;


  // return code ? <Dashboard code={code} /> : <Login />
