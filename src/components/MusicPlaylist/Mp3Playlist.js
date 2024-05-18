import React, { useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import music2 from '../../images/music3.gif';
import './style.css';
import { customFetch } from '../CustomFetch/customFetch';

const MP3Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [audioFile, setAudioFile] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const fetchPlaylist = async () => {
    try {
      const data = await customFetch('/api/playlist');
      setPlaylist(data.playlist);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPlaylist();

    const refreshInterval = setInterval(() => {
      fetchPlaylist();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(refreshInterval); // Clear interval on component unmount
  }, []);

  const fetchAudioBlob = async (mp3File) => {
    try {
      const response = await customFetch(`/api/play?file=${encodeURIComponent(mp3File)}`, { responseType: 'blob' });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const playAudio = async (mp3File, index) => {
    const audioBlobUrl = await fetchAudioBlob(mp3File);
    setAudioFile(audioBlobUrl);
    setIsPlaying(true);
    setCurrentTrackIndex(index);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleDownload = async (mp3File, e) => {
    e.preventDefault();
    try {
      const response = await customFetch(`/api/download?file=${encodeURIComponent(mp3File)}`, { responseType: 'blob' });
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = mp3File;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mp3-container">
      <div className="playlist-container">
        <div className="playlist">
          {playlist.map((mp3File, index) => (
            <div key={index} className="playlist-item" onClick={() => playAudio(mp3File, index)}>
              <img src={music2} alt={`Track ${index + 1}`} />
              <span>{`Track ${index + 1}: ${mp3File}`}</span>
              <button className="download-button" onClick={(e) => handleDownload(mp3File, e)}>
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <AudioPlayer
        src={audioFile || ''}
        autoPlayAfterSrcChange={false}
        customAdditionalControls={[
          <div key="now-playing">
            {isPlaying && currentTrackIndex !== null && (
              <div className="now-playing">
                Now Playing: Track {currentTrackIndex + 1}
              </div>
            )}
          </div>
        ]}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeking={(e) => setCurrentTime(e.target.currentTime)}
        currentTime={currentTime}
        style={{
          width: '50%',
          margin: '0 auto',
          marginTop: '22%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </div>
  );
};

export default MP3Playlist;
