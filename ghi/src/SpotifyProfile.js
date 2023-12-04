import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import useSpotifyAuth from './useSpotifyAuth'

const SpotifyProfile = () => {
    const accessToken = useSpotifyAuth();
    const [spotifyProfile, setSpotifyProfile] = useState(null);

    useEffect(() => {
        if (accessToken) {
            fetch('http://localhost:8000/spotify/user/profile', {
                headers: {
                    Authorization: `bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(data => setSpotifyProfile(data))
            .catch(error => console.error('Error fetching Spotify profile:', error))
        }
    }, [accessToken]);

    if (!spotifyProfile) {
        return <div>Loading Spotify profile...</div>;
    }

    return (
        <div>
            <h1>{spotifyProfile.display_name}</h1>
            {/* Display other details here */}
        </div>
    );
};

export default SpotifyProfile
