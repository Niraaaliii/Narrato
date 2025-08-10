import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('General');
  const [narrationAudio, setNarrationAudio] = useState(null);
  const [narrationScript, setNarrationScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  const handleAudienceChange = (event) => {
    setAudience(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setNarrationAudio(null);
    setNarrationScript('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tone', tone);
    formData.append('audience', audience);

    try {
      const response = await fetch('http://localhost:3001/narrate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate narration.');
      }

      // Check if the response is audio or JSON (for fallback)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('audio/mpeg')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setNarrationAudio(audioUrl);
      } else {
        const data = await response.json();
        setNarrationScript(data.narrationScript || 'No audio generated, but script is available.');
        if (data.message) {
          setError(data.message);
        }
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Narrato AI Presenter</h1>
      <div className="controls">
        <div className="file-upload">
          <label htmlFor="file-input">Upload Presentation (DOCX, PPTX):</label>
          <input
            id="file-input"
            type="file"
            accept=".docx,.pptx"
            onChange={handleFileChange}
          />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>

        <div className="options">
          <label htmlFor="tone-select">Tone:</label>
          <select id="tone-select" value={tone} onChange={handleToneChange}>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Confident">Confident</option>
            <option value="Enthusiastic">Enthusiastic</option>
            <option value="Informative">Informative</option>
          </select>

          <label htmlFor="audience-select">Audience:</label>
          <select id="audience-select" value={audience} onChange={handleAudienceChange}>
            <option value="General">General Public</option>
            <option value="Experts">Experts</option>
            <option value="Students">Students</option>
            <option value="Board of Directors">Board of Directors</option>
          </select>
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Narration'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {narrationAudio && (
        <div className="audio-player">
          <h2>Generated Narration:</h2>
          <audio controls src={narrationAudio}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {narrationScript && !narrationAudio && (
        <div className="narration-script">
          <h2>Narration Script (Audio Not Available):</h2>
          <p>{narrationScript}</p>
          <p className="fallback-note">
            (Audio generation failed or Speechify API key is not configured. Displaying script instead.)
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
