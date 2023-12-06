import React, { useState } from 'react';
import SongSelector from './SongSelector'

const ImageGeneratorForm = () => {
    const [userInput, setUserInput] = useState('');
    const [styleGuide, setStyleGuide] = useState('');
    const [selectedModel, setSelectedModel] = useState('ae-sdxl');
    const [upscale, setUpscale] = useState(false);
    const [selectedSongs, setSelectedSongs] = useState([]);

    const handleSubmit = asnyc () => {
        const promptData = {
            track_titles: selectedSongs.map(song => song.title),
            user_input: userInput,
            style_guide: styleGuide,
            model: selectedModel,
            upscale: upscale
        };
        const url = 'http://localhost:8000/generate-image';

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
            console.log(data)
        } catch (error) {
            console.error('Error in API call', error);
        }
    };

    return (
        <div>
            <SongSelector setSelectedSongs={setSelectedSongs} />
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
                <option value="model2">Model 2</option>
            {/* Add other model options */}
            </select>
            <label>
                Upscale Image:
                <input type="checkbox" checked={upscale} onChange={() => setUpscale(!upscale)} />
            </label>
            <button onClick={handleSubmit}>Generate Image</button>
        </div>
    );

};

export default ImageGeneratorForm;
