import React, { useEffect, useState } from 'react';
import useSpotifyAuth from './useSpotifyAuth'

const SpotifyProfile = () => {
    const [spotifyProfile, setSpotifyProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            fetch('http://localhost:8000/spotify/user/profile', {
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Spotify profile');
                }
                return response.json();
            })
            .then(data => {
                setSpotifyProfile(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Spotify profile', error);
                setError(Error.toString());
                setIsLoading(false);
            });
        }, []);

    if (isLoading) {
        return <div>Loading Spotify profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{spotifyProfile.display_name}</h1>
            {/* Display other details here */}
            {spotifyProfile.images && spotifyProfile.images[0] && (
                <img src={spotifyProfile.images[0].url} alt="Profile" />
            )}
        </div>
    );
};

export default SpotifyProfile;
