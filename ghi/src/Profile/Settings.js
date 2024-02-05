import React, { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { Box, Typography, Container, useTheme, Button } from '@mui/material';


const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000/spotifyauth&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-modify-private%20playlist-modify-public"


const Settings = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const theme = useTheme();
    const handleLinkSpotify = () => {
        window.location.href = AUTH_URL;
    };

    const handleDeleteAccount = async () =>{
        const confirm = window.confirm("Are you sure you want to delete your account? There's no going back.")
        if(confirm){
            try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/users/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            console.log(response)
            if (response.ok) {
                console.log('Account deleted successfully');
                window.location.replace('/signup')
            } else {
                // Account deletion failed
                console.error('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account', error);
        }
    }}


    return (
        <Box sx={{ display: 'flex', pt: '64px' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: open ? `240px` : `${theme.spacing(9)}` }}>
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
                    <Typography variant="h6" gutterBottom>
                        Account
                    </Typography>
                    <Button variant="contained" color="primary">
                        Update Account (Doesn't work yet)
                    </Button>
                    <p></p>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                        Delete
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Settings;


// const AUTH_URL =
//     "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
