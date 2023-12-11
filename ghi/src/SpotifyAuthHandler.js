import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSpotifyAuth from './useSpotifyAuth';

const SpotifyAuthHandler = () => {
    const isAuthorized = useSpotifyAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorized) {
            navigate('/spotifyauth');
        }
    }, [isAuthorized, navigate]);

    return <div>Processing Spotify Authorization...</div>;
};

export default SpotifyAuthHandler;
