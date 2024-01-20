import React, { useState } from 'react';
import SongSelector from './SongSelector';
import usePlaylists from '../Spotify/usePlaylists';
import {  FormControl, Select, MenuItem, InputLabel, TextField, FormControlLabel, Checkbox, Button, CircularProgress, Typography, Box } from '@mui/material';
// import NavBar from '../Navbar/NavBar';


const ImageGeneratorForm = () => {
    const [userInput, setUserInput] = useState('');
    const [styleGuide, setStyleGuide] = useState('');
    const [selectedModel, setSelectedModel] = useState('ae-sdxl-v1');
    const [upscale, setUpscale] = useState(false);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [negativePrompt, setNegativePrompt] = useState('');
    const [numInferenceSteps, setNumInferenceSteps] = useState(25);
    const [guidanceScale, setGuidanceScale] = useState(7);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    // const [imageFetchUrl, setImageFetchUrl] = useState('');
    const [fetchedImageUrl, setFetchedImageUrl] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const playlists = usePlaylists();


    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setImageUrl(null);
        setFetchedImageUrl(null);

        const promptData = {
            track_titles: selectedSongs.map(song => song.title),
            user_input: userInput,
            style_guide: styleGuide,
            model_id: selectedModel,
            upscale: upscale,
            negative_prompt: negativePrompt,
            num_inference_steps: numInferenceSteps,
            guidance_scale: guidanceScale
        };
        const url = `${process.env.REACT_APP_API_HOST}/adv-generate-image`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === "processing" && data.future_links && data.future_links.length > 0 && data.eta) {
                const futureImageUrl = data.future_links[0];
                setIsImageProcessing(true);
                // setImageFetchUrl(data.future_links[0]);
                setTimeout(() => fetchImage(futureImageUrl), data.eta * 1000);
            } else if (data.output && data.output.length > 0) {
                setImageUrl(data.output[0]);
            }
            // if (data && data.output && data.output.length > 0) {
            //     setImageUrl(data.output[0]);
            // }
        } catch (error) {
            console.error('Error in API call', error);
            setLoading(false);
            setError('Error generating image');
        }
    };

    const fetchImage = async (url, retries = 50, delay = 2000) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404 && retries > 0) {
                    console.log(`Waiting for image, attempts left: ${retries}`);
                    setTimeout(() => fetchImage(url, retries -1, delay), delay);
                    return;
                }
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }

            setFetchedImageUrl(url)
            setIsImageProcessing(false);
            setLoading(false);
        } catch (error) {
            console.error('Error Fetching image', error);
            setIsImageProcessing(false);
            setLoading(false);
            setError('Error fetching Final image');
        }
    };

    const renderImage = () => {
        const imgUrl = fetchedImageUrl || imageUrl;
        const imageKey = new Date().getTime(); // Unique Key
        console.log("Image URL: ", imgUrl)

        if (imgUrl) {
            return <img src={imgUrl} alt="Generated for real" key={imageKey} />;
        }
        return null;
    };

    return (
        <Box padding={2}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select a Playlist</InputLabel>
                <Select
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                    label="Select a Playlist"
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {playlists.map(playlist => (
                        <MenuItem key={playlist.id} value={playlist.id}>{playlist.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <SongSelector setSelectedSongs={setSelectedSongs} selectedSongs={selectedSongs} playlistId={selectedPlaylist} />

            <TextField
                fullWidth
                margin="normal"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                label="Additional Input"
                variant="outlined"
            />
            <TextField
                fullWidth
                margin="normal"
                type="text"
                value={styleGuide}
                onChange={(e) => setStyleGuide(e.target.value)}
                label="Style (e.g. Painting or Photographic"
                variant="outlined"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Model</InputLabel>
                <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    label="Select a Model"
                >
                    <MenuItem value="sdxl">Stable Diffusion XL</MenuItem>
                    <MenuItem value="anything-v3">Anime HD</MenuItem>
                    <MenuItem value="dream-shaper-8797">DreamShaper</MenuItem>
                    <MenuItem value="juggernaut-xl">HyperRealistic</MenuItem>
                    <MenuItem value="midjourney">MidJourney</MenuItem>
                    <MenuItem value="crystal-clear-xlv1">Crystal Clear XL v1</MenuItem>
                    <MenuItem value="ae-sdxl-v1">Realistic Cinematic</MenuItem>
                    <MenuItem value="sdxlceshi">SDXL Ceshi</MenuItem>
                </Select>
            </FormControl>

            <FormControlLabel
                control={<Checkbox checked={upscale} onChange={() => setUpscale(!upscale)} />}
                label="Upscale Image (May take longer)"
            />

            <TextField
                fullWidth
                margin="normal"
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                label="Exclude elements (e.g. 'No People')"
                variant="outlined"
            />

            <TextField
                fullWidth
                margin="normal"
                type="text"
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
                label="Number of Refining Steps"
                variant="outlined"
            />
            <TextField
                fullWidth
                margin="normal"
                type="text"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                label="Prompt Strength"
                variant="outlined"
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} margin="normal">
                Generate Image
            </Button>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {isImageProcessing ? <Typography>Processing Image...</Typography> : renderImage()}
        </Box>
    );
};

export default ImageGeneratorForm;
