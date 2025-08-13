import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Modern SVG Icons as React Components
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const SpeakerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

// Reusable Components
const GlassContainer = ({ children, className = '' }) => (
  <div className={`glass-container ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, variant = 'primary', className = '' }) => {
  const variantClass = `btn-${variant}`;
  return (
    <button 
      className={`btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={selectRef}>
      <label className="select-label">{label}</label>
      <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <span>▼</span>
      </div>
      <div className={`select-options ${isOpen ? 'show' : ''}`}>
        {options.map((option) => (
          <div 
            key={option}
            className="select-option"
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

const FileUploadArea = ({ onFileSelect, selectedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`file-upload-area ${isDragOver ? 'dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="upload-icon">📁</div>
      <div className="upload-text">
        {selectedFile ? selectedFile.name : 'Drop your presentation here or click to browse'}
      </div>
      <div className="upload-hint">
        Supports: PDF, DOCX, PPTX, TXT
      </div>
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".pdf,.docx,.pptx,.txt"
        onChange={handleFileInput}
      />
    </div>
  );
};

const LoadingSpinner = ({ text = 'Processing your presentation...' }) => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <div className="loading-text">{text}</div>
  </div>
);

const SlideCard = ({ slide, slideNumber, totalSlides }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="slide-card">
      <div className="slide-counter">
        Slide {slideNumber} of {totalSlides}
      </div>
      
      {slide.usedFallback && (
        <div className="message message-warning">
          ⚠️ Using basic processing due to AI service limits
        </div>
      )}

      <div className="slide-content">
        <h3>Original Content</h3>
        <p className="original-text">{slide.originalText}</p>
        
        <h3>AI-Generated Narration</h3>
        <p className="rewritten-text">{slide.rewrittenText}</p>
      </div>

      <div className="audio-player">
        <div className="audio-controls">
          <button 
            className="play-button"
            onClick={isPlaying ? handlePause : handlePlay}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="waveform">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="waveform-bar" 
                style={{ 
                  left: `${i * 3.3}%`, 
                  animationDelay: `${i * 0.1}s`,
                  height: `${20 + Math.random() * 60}%`
                }} 
              />
            ))}
          </div>
        </div>
        <audio 
          ref={audioRef}
          src={`data:${slide.audioMimeType};base64,${slide.audioBase64}`}
          onEnded={handleAudioEnd}
        />
      </div>
    </div>
  );
};

const WelcomeScreen = () => (
  <div className="welcome-screen">
    <div className="welcome-icon">🎤</div>
    <h2 className="welcome-title">Welcome to Narrato AI</h2>
    <p className="welcome-subtitle">
      Transform your presentations into engaging audio narrations with AI
    </p>
    <div className="welcome-features">
      <div className="feature-item">
        <span className="feature-icon">🎯</span>
        <span>Audience-specific narration</span>
      </div>
      <div className="feature-item">
        <span className="feature-icon">🎨</span>
        <span>Multiple file formats supported</span>
      </div>
      <div className="feature-item">
        <span className="feature-icon">⚡</span>
        <span>Real-time audio generation</span>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audience, setAudience] = useState('Students');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);

  const audienceOptions = ['Students', 'Executives', 'Technical', 'Layperson'];

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSlides([]);
    setCurrentSlide(0);
    setNote(null);
    setError(null);
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
    setNote(null);

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
      setNote(data.note);

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
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Narrato AI</h1>
        <p className="app-subtitle">Transform presentations into engaging audio narrations</p>
      </header>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {note && (
        <div className="message message-note">
          <strong>Note:</strong> {note}
        </div>
      )}

      {!loading && slides.length === 0 && (
        <GlassContainer>
          <div className="upload-section">
            <div>
              <FileUploadArea 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>
            <div>
              <CustomSelect
                label="Target Audience"
                value={audience}
                onChange={setAudience}
                options={audienceOptions}
              />
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedFile}
            >
              Generate Narration
            </Button>
          </div>
        </GlassContainer>
      )}

      {loading && <LoadingSpinner />}

      {slides.length > 0 && currentSlideData && (
        <div className="presentation-player">
          <SlideCard 
            slide={currentSlideData}
            slideNumber={currentSlide + 1}
            totalSlides={slides.length}
          />
          
          <div className="slide-navigation">
            <Button 
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              variant="secondary"
            >
              <ChevronLeftIcon />
              Previous
            </Button>
            <Button 
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="secondary"
            >
              Next
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}

      {slides.length === 0 && !loading && !error && <WelcomeScreen />}
    </div>
  );
}

export default App;
