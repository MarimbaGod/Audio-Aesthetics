import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const SongSelector = ({ playlistId, selectedSongs, setSelectedSongs }) => {
    const [songOptions, setSongOptions] = useState([]);
    // const [selectedSongs, setSelectedSongs] = useState([]);

    useEffect(() => {
        if (playlistId) {
        // fetch songs
            fetch(`${process.env.REACT_APP_API_HOST}/spotify/playlist/${playlistId}/tracks`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response Data:", data);
                // Assuming data is an array of song titles
                setSongOptions(data.items || data);
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
                setSongOptions([]);
            });
        }
    }, [playlistId]);

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={songOptions}
            getOptionLabel={(option) => option.title}
            filterSelectedOptions
            value={selectedSongs}
            onChange={(event, newValue) => {
                setSelectedSongs(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Select Songs"
                    placeholder="Songs"
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip label={option.title} {...getTagProps({ index })} />
                ))
            }
        />
    );
};

export default SongSelector;
