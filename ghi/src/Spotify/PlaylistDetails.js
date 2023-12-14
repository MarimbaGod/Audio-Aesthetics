import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

const PlaylistDetails = ({ handleSelectTrack }) => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_API_HOST}/spotify/playlist/${playlistId}`, {
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
                console.log(data) // Just checkin
                setPlaylist(data);
            } catch (error) {
                console.error("Error fetching playlist details:", error);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);


    const onSongClick = (trackUri) => {
        // const trackUri = `spotify:track:${trackId}`;
        handleSelectTrack(trackUri);
    };

    if (!playlist || !playlist.tracks || !playlist.tracks.items) {
        return <div>Loading playlist details... Please Enjoy a Snack</div>;
    }

    return (
        <Grid container spacing={2}>
            {playlist.tracks.items.map(item => (
                <Grid item xs={12} md={6} lg={4} key={item.track.id}>
                    <Card onClick={() => onSongClick(item.track.id)} sx={{ cursor: 'pointer' }}>
                    {item.track.album.images.length > 0 && (
                        <CardMedia
                            component="img"
                            height="140"
                            image={item.track.album.images[0].url} // Adjust to data structure
                            alt={item.track.name}
                        />
                        )}
                        <CardContent>
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
    );
};

export default PlaylistDetails;
