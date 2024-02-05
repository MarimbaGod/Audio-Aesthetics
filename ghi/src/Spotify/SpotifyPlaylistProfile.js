import React, {useState} from 'react';
import { Container, Grid, Card, CardContent, Box, Avatar, Typography, Divider, useTheme } from '@mui/material'
import NavBar from '../Navbar/NavBar';
import useUserDetails from '../Profile/useUserDetails';
import usePlaylists from './usePlaylists';

import { useNavigate } from 'react-router-dom';


export default function SpotifyPlaylistProfile() {
    const userDetails = useUserDetails();
    const playlists = usePlaylists();
    const [open, setOpen] = useState(true);

    // New Content
    const navigate = useNavigate();

    const openPlaylistDetails = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };
    const theme = useTheme();

    const toggleDrawer = () => {
        setOpen(!open);
    };
    //

    if (!userDetails) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: open ? `240px` : `${theme.spacing(9)}` }}>
                <Grid container spacing={3} justifyContent="center">
                    {/* User Profile */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar
                                    sx={{ width: 160, height: 160, mb: 2, mx: 'auto' }}
                                    src={userDetails.img_url}
                                    alt="User Profile"
                                />
                                <Typography variant="h4">{userDetails.username}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {userDetails.email}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Separator */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 4 }} />
                    </Grid>
                    {/* Playlist Render */}
                    {playlists.map((playlist, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card onClick={() => openPlaylistDetails(playlist.id)}>
                                <CardContent>
                                    <Typography variant="h6">{playlist.name}</Typography>
                                    {playlist.images && playlist.images.length > 0 ? (
                                        <img src={playlist.images[0].url} alt={playlist.name} style={{ width: '100%' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>No Image</div>
                                    )}
                                    <Typography variant="body2">
                                        {playlist.tracks.total} Tracks
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
