import React from 'react';
import { Container, Grid, Card, CardContent, Box, Avatar, Typography } from '@mui/material'
import useUserDetails from './useUserDetails';
import usePlaylists from './usePlaylists';

export default function UserProfile() {
    const userDetails = useUserDetails();
    const playlists = usePlaylists();

    if (!userDetails) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                {/* User Profile */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{ width: 128, height: 128, mb: 2 }}
                                    src={userDetails.img_url}
                                    alt="User Profile"
                                />
                                <Typography variant="h5">{userDetails.username}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {userDetails.email}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            {/* Playlist Render */}
                {playlists.map((playlist, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
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
    );
}
