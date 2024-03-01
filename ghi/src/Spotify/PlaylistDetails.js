import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Container, useTheme, Button } from '@mui/material';
import NavBar from '../Navbar/NavBar';
const PlaylistDetails = ({ handleSelectTrack }) => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const theme = useTheme();

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/spotify/playlist/${playlistId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }

                const data = await response.json();
                setPlaylist(data);
            } catch (error) {
                console.error("Error fetching playlist details:", error);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);


    const onSongClick = (trackUri) => {
        handleSelectTrack(trackUri);
    };

    if (!playlist || !playlist.tracks || !playlist.tracks.items) {
        return <div>Loading playlist details... Please Enjoy a Snack</div>;
    }

    return (
        <Box sx={{ display: "flex" }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container  maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: open ? `240px` : `${theme.spacing(9)}` }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={playlist.images[0]?.url}
                                alt="Playlist Cover"
                                sx={{ width: 1, height: 1, maxWidth: 524, maxHeight: 524 }}
                            />
                        </Card>
                        <Button variant="contained" component="label" sx={{mt: 2}}>
                            Upload Photo
                            <input type="file" hidden />
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Typography variant="h4" gutterBottom>
                            {playlist.name}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    {playlist.tracks.items.map(item => (
                        <Grid item xs={12} md={6} lg={4} key={item.track.id}>
                            <Card onClick={() => onSongClick(item.track.uri)} sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                            {item.track.album.images.length > 0 && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.track.album.images[0].url}
                                    alt={item.track.name}
                                />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5">
                                        {item.track.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.track.artists.map(artist => artist.name).join(', ')} - {item.track.album.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PlaylistDetails;
