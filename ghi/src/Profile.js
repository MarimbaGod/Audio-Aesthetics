import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function UserProfile() {
    // const { token } = useToken();
    const [userProfile, setUserProfile] = useState(null);
    // const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/details', {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    const { spotify_access_token, spotify_refresh_token, ...userDetails } = data;
                    setUserProfile(userDetails);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{ width: 128, height: 128, mb: 2 }}
                                    src={userProfile.img_url} // Replace with your image url path
                                    alt="User Profile"
                                />
                                <Typography variant="h5">{userProfile.username}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {userProfile.email}
                                </Typography>
                                {/*  Add user details  */}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
