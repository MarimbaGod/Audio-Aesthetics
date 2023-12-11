import React, { createContext, useState, useContext } from 'react';

const SpotifyContext = createContext();

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
    const [trackUri, setTrackUri] = useState('');
    const [token, setToken] = useState('');

    return (
        <SpotifyContext.Provider value={{ trackUri, setTrackUri, token, setToken }}>
            {children}
        </SpotifyContext.Provider>
    )
}
