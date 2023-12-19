import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./HomeExploreSearch/Homepage";
import ExplorePage from "./HomeExploreSearch/ExplorePage";
import SignIn from "./Auth/SignIn";
import Logout from "./Auth/Logout";
import Posts from "./Posts/Posts";
import SelfProfile from "./Profile/SelfProfile";
import SpotifyPlayer from "./Spotify/SpotifyPlayer";
import Search from "./HomeExploreSearch/Search";
import SpotifyProfile from "./Spotify/SpotifyProfile";
import SpotifyPlaylistProfile from "./Spotify/SpotifyPlaylistProfile";
import SignupForm from "./Auth/SignupForm";
import Settings from "./Profile/Settings";
import SpotifyAuthHandler from "./Spotify/SpotifyAuthHandler";
import Profile from "./Profile/Profile";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import Groups from "./Groups/Groups";
import CreateGroup from "./Groups/CreateGroup";
import SpotifyContainer from "./Spotify/SpotifyContainer";
import ImageGeneratorForm from "./StableDiffusion/ImageGeneratorForm";
import useUserDetails from "./Profile/useUserDetails";
import PlaylistDetails from "./Spotify/PlaylistDetails";



function App() {
  const domain = /https:\/\/[^/]+/;
  const baseUrl = process.env.REACT_APP_API_HOST;
  const basename = process.env.PUBLIC_URL.replace(domain, "");

  const userDetails = useUserDetails();
  const accessToken = userDetails?.spotify_access_token;
  const [trackUri, setTrackUri] = useState('');

  const handleSelectTrack = (uri) => {
    setTrackUri(uri)
  };

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider baseUrl={baseUrl}>
        <Routes>
          <Route exact path="/aesthetics" element={<ImageGeneratorForm baseUrl={baseUrl} />}></Route>
          <Route exact path="/player" element={<SpotifyContainer handleSelectTrack={handleSelectTrack} baseUrl={baseUrl} />}></Route>
          <Route exact path="/playlist/:playlistId" element={<PlaylistDetails handleSelectTrack={handleSelectTrack} />} />
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
            element={<Homepage baseUrl={baseUrl} token={accessToken} />}
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
        {accessToken && <SpotifyPlayer token={accessToken} trackUri={trackUri} />}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
