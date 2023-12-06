import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import ExplorePage from "./ExplorePage";
import SignIn from "./SignIn";
import Logout from "./Logout";
import Posts from "./Posts";
// import Profile from "./ExProfile";
import Search from "./Search";
import SpotifyProfile from "./SpotifyProfile";
import UserProfile from "./UserProfile";
import SignupForm from "./SignupForm";
import Settings from "./Settings";
import SpotifyAuthHandler from "./SpotifyAuthHandler";
import Profile from "./Profile";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import Groups from "./Groups";
function App() {
  // const baseUrl = "http://localhost:8000";

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider basename={basename}>
        <Routes>
          <Route exact path="/" element={<SpotifyAuthHandler />}></Route>
          <Route exact path="/signin" element={<SignIn />}></Route>
          <Route exact path="/logout" element={<Logout />}></Route>
          <Route exact path="/posts" element={<Posts />}></Route>
          <Route exact path="/signup" element={<SignupForm />}></Route>
          <Route exact path="/explore" element={<ExplorePage />}></Route>
          <Route exact path="/home" element={<Homepage />}></Route>
          {/* <Route exact path="/profile" element={<Profile />}></Route> */}
          <Route exact path="/search" element={<Search />}></Route>
          <Route exact path="/profile" element={<UserProfile />}></Route>
          <Route exact path="/user-profile" element={<Profile />}></Route>
          <Route
            exact
            path="/spotify-profile"
            element={<SpotifyProfile />}
          ></Route>
          <Route exact path="/settings" element={<Settings />}></Route>
          <Route exact path="/groups" element={<Groups />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
