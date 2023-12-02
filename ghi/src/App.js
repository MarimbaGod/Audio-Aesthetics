import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import ExplorePage from "./ExplorePage";
import SignIn from "./SignIn";
import Logout from "./Logout";
import Posts from "./Posts";
import Profile from "./Profile";

import SignupForm from "./SignupForm";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";

function App() {
  const baseUrl = "http://localhost:8000";

  return (
    <BrowserRouter>
      <AuthProvider baseUrl={baseUrl}>
        <Routes>
          <Route exact path="/" element={<Homepage />}></Route>
          <Route exact path="/signin" element={<SignIn />}></Route>
          <Route exact path="/logout" element={<Logout />}></Route>
          <Route exact path="/posts" element={<Posts />}></Route>
          <Route exact path="/signup" element={<SignupForm />}></Route>
          <Route exact path="/explore" element={<ExplorePage />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
