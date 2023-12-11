import {useState, useEffect} from "react"


function useAuth(userProfile, setUserProfile) {
    useEffect(() => {
        if (!userProfile.spotify_refresh_token) return;

        const refreshInterval = 55 * 60 * 1000;

        const interval = setInterval(() => {
            fetch(`${process.env.REACT_APP_API_HOST}/spotify/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: userProfile.spotify_refresh_token }),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to refresh access token');
                }
                return res.json();
            })
            .then(data => {
                setUserProfile(prevState => ({
                    ...prevState,
                    spotify_access_token: data.access_token,
                }));
            })
            .catch(error => {
                console.error('Error refreshing access token:', error);
            });
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [userProfile.spotify_refresh_token, setUserProfile]);

    // Returns the current access token
    return userProfile.spotify_access_token;
}

export default useAuth;
