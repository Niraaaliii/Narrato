import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audience, setAudience] = useState('Students');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audienceOptions = [
    'Students',
    'Executives',
    'Technical',
    'Layperson'
  ];

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSlides([]);
    setCurrentSlide(0);
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
    setSlides([]);
    setCurrentSlide(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('audience', audience);

    try {
      const response = await fetch('http://localhost:3001/narrate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate narration.');
      }

      const data = await response.json();
      setSlides(data.slides);
      setCurrentSlide(0);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setIsPlaying(false);
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    // Auto-advance to next slide after audio ends
    if (currentSlide < slides.length - 1) {
      setTimeout(() => {
        handleNextSlide();
      }, 1000);
    }
  };

  const currentSlideData = slides[currentSlide];

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
          <label htmlFor="audience-select">Audience:</label>
          <select id="audience-select" value={audience} onChange={handleAudienceChange}>
            {audienceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} disabled={loading || !selectedFile}>
          {loading ? 'Processing...' : 'Generate Presentation'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {slides.length > 0 && currentSlideData && (
        <div className="presentation-player">
          <h2>Presentation Player</h2>
          
          <div className="slide-counter">
            Slide {currentSlide + 1} of {slides.length}
          </div>

          <div className="slide-content">
            <h3>Original Content:</h3>
            <p>{currentSlideData.originalText}</p>
            
            <h3>AI-Generated Narration:</h3>
            <p>{currentSlideData.rewrittenText}</p>
          </div>

          <div className="audio-controls">
            <audio
              controls
              src={`data:${currentSlideData.audioMimeType};base64,${currentSlideData.audioBase64}`}
              onPlay={handlePlayAudio}
              onEnded={handleAudioEnd}
              key={currentSlide}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="slide-navigation">
            <button 
              onClick={handlePrevSlide} 
              disabled={currentSlide === 0}
            >
              Previous
            </button>
            <button 
              onClick={handleNextSlide} 
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {slides.length === 0 && !loading && !error && (
        <div className="welcome-message">
          <p>Upload a presentation file and select your audience to get started!</p>
        </div>
      )}
    </div>
  );
}

export default App;
