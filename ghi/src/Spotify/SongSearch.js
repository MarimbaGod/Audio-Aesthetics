import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';



const SongSearch = ({ onSearchResult }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        try{
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/spotify/search?query=${encodeURIComponent(query)}&type=track`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            onSearchResult(data.tracks.items); // Pass results to parent component
        } catch (error) {
            console.error('Error fetching search results:', error)
        }
    };

    return (
        <div style={{ margin: '20px 0'}}>
            <TextField
                label="Search for a Song"
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
            </Button>
        </div>
    );
};

export default SongSearch;
