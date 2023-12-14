import React, { createContext, useState, useContext } from 'react';

const SpotifyPlayerContext = createContext();

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export const SpotifyPlayerProvider = ({ children }) => {
    const [trackUri, setTrackUri] = useState('');

    const handleSelectTrack = (uri) => {
        setTrackUri(uri);
    };

    return (
        <SpotifyPlayerContext.Provider value={{ trackUri, handleSelectTrack }}>
            {children}
        </SpotifyPlayerContext.Provider>
    );
};
