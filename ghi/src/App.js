import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import ExplorePage from "./ExplorePage";
import SignIn from "./SignIn";
import Logout from "./Logout";
import Posts from "./Posts";
import SelfProfile from "./SelfProfile";
// import Profile from "./ExProfile";
import Search from "./Search";
import SpotifyProfile from "./SpotifyProfile";
import SpotifyPlaylistProfile from "./SpotifyPlaylistProfile";
import SignupForm from "./SignupForm";
import Settings from "./Settings";
import SpotifyAuthHandler from "./SpotifyAuthHandler";
import Profile from "./Profile";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import Groups from "./Groups";
import CreateGroup from "./CreateGroup";
import SpotifyContainer from "./SpotifyContainer";
import ImageGeneratorForm from "./StableDiffusion/ImageGeneratorForm";

function App() {
  const domain = /https:\/\/[^/]+/;
  const baseUrl = process.env.REACT_APP_API_HOST;
  const basename = process.env.PUBLIC_URL.replace(domain, "");

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider baseUrl={baseUrl}>
        <Routes>
          <Route exact path="/aesthetics" element={<ImageGeneratorForm baseUrl={baseUrl} />}></Route>
          <Route exact path="/player" element={<SpotifyContainer baseUrl={baseUrl} />}></Route>
          <Route
            exact
            path="/"
            element={<ExplorePage baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/signin"
            element={<SignIn baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/logout"
            element={<Logout baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/posts"
            element={<Posts baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/signup"
            element={<SignupForm baseUrl={baseUrl} />}
          />
          <Route
            exact
            path="/home"
            element={<Homepage baseUrl={baseUrl} />}
          ></Route>
          {/* <Route exact path="/profile" element={<Profile />}></Route> */}
          <Route
            exact
            path="/search"
            element={<Search baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/spotifyplaylist"
            element={<SpotifyPlaylistProfile baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/profile/:user_id"
            element={<Profile baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/spotify-profile"
            element={<SpotifyProfile baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/settings"
            element={<Settings baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/spotifyauth"
            element={<SpotifyAuthHandler baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/groups"
            element={<Groups baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/groups/create"
            element={<CreateGroup baseUrl={baseUrl} />}
          ></Route>
          <Route
            exact
            path="/selfprofile"
            element={<SelfProfile baseUrl={baseUrl} />}
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
