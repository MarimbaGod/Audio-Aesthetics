import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const SongSelector = () => {
    const [songOptions, setSongOptions] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);

    useEffect(() => {
        // fetch songs
        fetch('http://localhost:8000/spotify/playlist/{playlist_id}/tracks')
            .then(response => response.json())
            .then(data => {
                // Assuming data is an array of song titles
                setSongOptions(data);
            });
    }, []);

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
