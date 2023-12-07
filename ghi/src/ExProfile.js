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
    const [playlists, setPlaylists] = useState([]);
    // const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/user/details`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    // const { spotify_access_token, spotify_refresh_token, ...userDetails } = data;
                    setUserProfile(data); //changed to daata from userDetails
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/spotify/playlists`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data.items);
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
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
                {/* Playlist Render*/}
                {playlists.map((playlist, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{playlist.name}</Typography>
                                {/* If img array at least 1 img*/}
                                {playlist.images && playlist.images.length > 0 ? (
                                    <img src={playlist.images[0].url} alt={playlist.name} style={{ width: '100%' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>No Image</div>
                                )}
                                {/* Optional render default img */}
                                {/* Other playlist details */}
                                <Typography variant="body2">
                                    {playlist.tracks.total} Tracks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
{/* <img src="https://tinyurl.com/Dimg-url" alt="Default Playlist" style={{ width: '100%', height: '200px' }} /> */}
