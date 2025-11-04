import React, { useState, useEffect } from 'react';
// import './VoiceNotes.css'; // Import the CSS file for styling

const VoiceNotes = () => {
  const audioUrl = 'path_to_pre_recorded_audio_file'; // Replace with the actual URL or path to your pre-recorded audio file

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audioElement = document.getElementById('voice-notes-audio');
    audioElement.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    const audioElement = document.getElementById('voice-notes-audio');
    audioElement.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    const audioElement = document.getElementById('voice-notes-audio');

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="voice-notes-container">
      <div className="voice-notes-controls">
        {/* <button className="voice-notes-button" onClick={handlePlay}>
          Play
        </button> */}
        <i className="fa-solid fa-play" onClick={handlePlay}></i>
        {/* <button className="voice-notes-button" onClick={handlePause}>
          Pause
        </button> */}
        <i className="fa-solid fa-pause" onClick={handlePause}></i>
      </div>
      <div className="voice-notes-progress-bar">
        <div className="voice-notes-progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="voice-notes-duration">
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>
      <audio id="voice-notes-audio" src={audioUrl}></audio>
    </div>
  );
};

export default VoiceNotes;