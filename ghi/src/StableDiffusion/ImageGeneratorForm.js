import React, { useState } from 'react';
import SongSelector from './SongSelector'
import usePlaylists from '../usePlaylists'

const ImageGeneratorForm = () => {
    const [userInput, setUserInput] = useState('');
    const [styleGuide, setStyleGuide] = useState('');
    const [selectedModel, setSelectedModel] = useState('ae-sdxl-v1');
    const [upscale, setUpscale] = useState(false);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const [imageFetchUrl, setImageFetchUrl] = useState('');
    const [fetchedImageUrl, setFetchedImageUrl] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const playlists = usePlaylists();


    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        const promptData = {
            track_titles: selectedSongs.map(song => song.title),
            user_input: userInput,
            style_guide: styleGuide,
            model_id: selectedModel,
            upscale: upscale
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
            if (data.status === "processing" && data.fetch_result && data.eta) {
                setIsImageProcessing(true);
                setImageFetchUrl(data.fetch_result);
                // setTimeout(() => fetchImage(data.fetch_result), data.eta * 1000);
            } else if (data.output && data.output.length > 0) {
                setImageUrl(data.output[0]);
            }
            console.log(data);
            // if (data && data.output && data.output.length > 0) {
            //     setImageUrl(data.output[0]);
            // }
            // console.log(data)
        } catch (error) {
            console.error('Error in API call', error);
            setLoading(false);
            setError('Error generating image');
        }
    };

    // const fetchImage = async (url) => {
    //     try {
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //             throw new Error(`HTTP Error! Status: ${response.status}`);
    //         }
    //     }
    // }

    return (
        <div>
            <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                <option value="">Select a Playlist</option>
                {playlists.map(playlist => (
                    <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
            </select>

            <SongSelector setSelectedSongs={setSelectedSongs} selectedSongs={selectedSongs} playlistId={selectedPlaylist} />
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Additional Input"
            />
            <input
                type="text"
                value={styleGuide}
                onChange={(e) => setStyleGuide(e.target.value)}
            />
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="ae-sdxl-v1">AE-SDXL-V1</option>
                <option value="sdxlceshi">SDXL Ceshi</option>
                <option value="sdxl">SDXL</option>
                <option value="crystal-clear-xlv1">Crystal Clear XL v1</option>
            {/* Add other model options */}
            </select>
            <label>
                Upscale Image:
                <input type="checkbox" checked={upscale} onChange={() => setUpscale(!upscale)} />
            </label>
            <button onClick={handleSubmit}>Generate Image</button>

            {imageUrl && <img src={imageUrl} alt="Generated :D" />}
        </div>
    );
};

export default ImageGeneratorForm;
