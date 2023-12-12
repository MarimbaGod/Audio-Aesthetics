import React, { useState } from 'react';
import SongSelector from './SongSelector';
import usePlaylists from '../Spotify/usePlaylists';
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

    const fetchImage = async (url, retries = 3, delay = 2000) => {
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
            // const imageData = await response.json();
            // setFetchedImageUrl(imageData.imageUrl);
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
                placeholder="Style ie: Painting"
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
            {/* Negative Prompt */}
            <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Exclude elements (e.g., 'no people')"
            />
            {/* Number of Inference Steps */}
            <input
                type="number"
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
                placeholder="Number of Inference Steps"
            />
            {/* Guidance Scale */}
            <input
                type="number"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                placeholder="Guidance Scale"
            />
            <button onClick={handleSubmit}>Generate Image</button>

            {imageUrl && <img src={imageUrl} alt="Generated :D" />}
            {loading && <p>Loading, Please Wait...</p>}
            {error && <p>{error}</p>}
            {isImageProcessing ? <p>Processing Image...</p> : renderImage()}
            {/* {isImageProcessing ? <p>Processing Image...</p> : <img src={fetchedImageUrl || imageUrl} alt="Generated" />} */}
        </div>
    );
};

export default ImageGeneratorForm;
