import React, { useState } from 'react';
import NavBar from './NavBar';
import { Container, Typography, Button, Box } from '@mui/material';


const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-modify-private%20playlist-modify-public"


const Settings = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLinkSpotify = () => {
        window.location.href = AUTH_URL;
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    User Settings
                </Typography>
                {/* Other settings here */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Spotify Account
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleLinkSpotify}>
                        Link Spotify Account
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Settings;


// const AUTH_URL =
//     "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
