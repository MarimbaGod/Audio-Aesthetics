import React, {useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useSpotifyAuth = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            fetch('http://localhost:8000/spotify/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
                credentials: 'include',
            })
            .then(response => {
                if (response.ok) {
                    setIsAuthorized(true);
                } else {
                    console.error('Failed to exchange Spotify Authorization Code')
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }, []);

    const goToSpotifyProfile = () => {
        history.push('/spotify-profile');
    };

    if (!isAuthorized) {
        return <div>Authorizing... Please Hold</div>;
    }

    return (
        <div>
            <h1>Spotify Authorization Successful</h1>
            <button onClick={goToSpotifyProfile}>Go to Spotify Profile</button>
        </div>
    );
};

export default useSpotifyAuth;
