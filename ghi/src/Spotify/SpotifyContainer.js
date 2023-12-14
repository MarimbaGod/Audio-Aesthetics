import React, { useState } from 'react';
// import SpotifyPlayer from './SpotifyPlayer';
import SongSearch from './SongSearch';
// import useUserDetails from '../Profile/useUserDetails';
import { Box, Grid, Card, CardContent, Typography, Container, useTheme } from '@mui/material';
import NavBar from '../Navbar/NavBar';


const SpotifyContainer = ({ handleSelectTrack }) => {
    // const [trackUri, setTrackUri] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const userDetails = useUserDetails();
    // const token = userDetails?.spotify_access_token;
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleSearchResult = (tracks) => {
        setSearchResults(tracks)
    };

    // const handleSelectTrack = (uri) => {
    //     setTrackUri(uri);
    // };

    return (
        <Box sx={{ display: 'flex', pt: '64px' }}>
            <NavBar open={open} toggleDrawer={toggleDrawer} />
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: open ? `240px` : `${theme.spacing(9)}` }}>
                <SongSearch onSearchResult={handleSearchResult} />
                <Grid container spacing={2} justifyContent="center">
                    {searchResults.map(track => (
                        <Grid item xs={12} sm={6} md={4} key={track.id}>
                            <Card onClick={() => handleSelectTrack(track.uri)} sx={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <img src={track.album.images[0].url} alt={track.name} style={{ width: '100%', height: 'auto' }} />
                                    <Typography variant="h6">{track.name}</Typography>
                                    <Typography variant="body2">{track.artists[0].name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* <Box sx={{ position: 'fixed', botom: 0, left: 0, right: 0, zIndex: 1000}}>
                <SpotifyPlayer token={token} trackUri={trackUri} />
            </Box> */}
        </Box>
    )
};

export default SpotifyContainer;
