import React, { useEffect } from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';

const SpotifyPlayer = ({ token, trackUri }) => {
    // const [token, setToken] = useState(null);
    // const [deviceId, setDeviceId] = useState(null);
  useEffect(() => {
    // if (trackUri)
    // Fetch or set your Spotify access token
    // You might want to use a library like `react-redux` for managing state
    // or any other state management solution.
    // For simplicity, we're setting the token directly here.
    // Replace '[Your access token]' with your actual access token.
    // Note: Ensure the token is valid and has the required scopes.
    // setToken("");
    // setDeviceId("c98fce128c702509372775883f5d66f3ed79f996")
  }, [trackUri]);

  const handleReady = ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  };

  const handleNotReady = ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  };

  const handleInitializationError = ({ message }) => {
    console.error(message);
  };

  const handleAuthenticationError = ({ message }) => {
    console.error(message);
  };

  const handleAccountError = ({ message }) => {
    console.error(message);
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000}}>
        <SpotifyWebPlayer
        token={token}
        uris={trackUri ? [trackUri] : []}
        name="Web Playback SDK React Player"
        volume={0.5}
        onReady={handleReady}
        onNotReady={handleNotReady}
        onInitializationError={handleInitializationError}
        onAuthenticationError={handleAuthenticationError}
        onAccountError={handleAccountError}
        />
    </div>
  );
};

export default SpotifyPlayer;
