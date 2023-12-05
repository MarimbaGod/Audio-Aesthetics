import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import useSpotifyAuth from './useSpotifyAuth'
import { useNavigate } from 'react-router-dom'

const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


const Settings = () => {
    const handleLinkSpotify = () => {
        window.location.href = AUTH_URL;
    };

    return (
        <div>
            <h1>User Setting</h1>
            {/* Other Settings Here */}
            <div>
                <h2>Spotify Account</h2>
                <button onClick={handleLinkSpotify}></button>
            </div>
        </div>
    );
};

export default Settings;


// const AUTH_URL =
//     "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


// const Settings = () => {
//     const navigate = useNavigate();
//     const isAuthorized = useSpotifyAuth();

//     const handleLinkSpotify = () => {
//         if (!isAuthorized) {
//             window.location.href = AUTH_URL
//         } else {
//             navigate('/spotify-profile');
//         }
//     };

//     return (
//         <div>
//             <h1>User Setting</h1>
//             {/* Other Settings Here */}

//             <div>
//                 <h2>Spotify Account</h2>
//                 <button onClick={handleLinkSpotify}>
//                     {isAuthorized ? 'View Spotify Profile' : 'Link Spotify Account'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Settings;
