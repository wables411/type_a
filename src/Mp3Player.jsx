import React, { useState, useRef, useEffect, useCallback } from 'react';

const Mp3Player = () => {
  const songs = [
    '/assets/lovestory.mp3',
    '/assets/mononoaware.mp3',
    '/assets/BITCH_I_DID-THE.RACE.mp3',
    '/assets/DESTRUCTION.mp3',
    '/assets/dqdvTSDlaMKx.mp3',
    '/assets/exorcism.mp3',
    '/assets/Heart Of Stone.mp3',
    '/assets/long day.mp3',
    '/assets/cloud.mp3',
    '/assets/recipie for a femcel (boxxy f4g V2).mp3',
  ];

  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  // Handle play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) {
      console.log('Player ref not initialized');
      return;
    }

    if (!isPlaying) {
      playerRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Audio playback started');
      }).catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      playerRef.current.pause();
      setIsPlaying(false);
      console.log('Audio playback paused');
    }
  }, [isPlaying]);

  const playAudio = useCallback(() => {
    if (!playerRef.current) {
      console.log('Player ref not initialized');
      return;
    }

    playerRef.current.play().then(() => {
      setIsPlaying(true);
      console.log('Audio playback started');
    }).catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  }, []);

  const nextSong = useCallback(() => {
    const wasPlaying = isPlaying; // Capture the current playing state
    setCurrentSong((prev) => (prev + 1) % songs.length);
    setCurrentTime(0);
    setIsPlaying(false); // Temporarily set to false to reset the player
    console.log('Switched to next song');

    // Autoplay if the player was already playing
    if (wasPlaying) {
      setTimeout(() => {
        playAudio();
      }, 100); // Small delay to ensure the audio element is ready
    }
  }, [isPlaying, playAudio, songs.length]);

  const previousSong = useCallback(() => {
    const wasPlaying = isPlaying; // Capture the current playing state
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
    setIsPlaying(false); // Temporarily set to false to reset the player
    console.log('Switched to previous song');

    // Autoplay if the player was already playing
    if (wasPlaying) {
      setTimeout(() => {
        playAudio();
      }, 100); // Small delay to ensure the audio element is ready
    }
  }, [isPlaying, playAudio, songs.length]);

  // Update timer and handle audio events
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const updateTimer = () => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration || 0);
    };

    const handleError = (e) => {
      console.error('Audio loading error:', e);
      console.error('Audio source:', player.src);
      console.error('Error code:', player.error?.code);
      console.error('Error message:', player.error?.message);
    };

    player.addEventListener('timeupdate', updateTimer);
    player.addEventListener('loadedmetadata', updateTimer);
    player.addEventListener('ended', nextSong);
    player.addEventListener('error', handleError);

    return () => {
      player.removeEventListener('timeupdate', updateTimer);
      player.removeEventListener('loadedmetadata', updateTimer);
      player.removeEventListener('ended', nextSong);
      player.removeEventListener('error', handleError);
    };
  }, [currentSong, nextSong]);

  const getSongTitle = (filePath) => {
    const fileName = filePath.split('/').pop();
    return fileName.replace('.mp3', '');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="mp3-player">
      <div className="winamp-display">
        <div className="song-title">{getSongTitle(songs[currentSong])}</div>
        <div className="display-bottom">
          <div className="equalizer">
            {Array(10)
              .fill()
              .map((_, i) => (
                <div key={i} id={`eq-bar-${i}`} className="eq-bar"></div>
              ))}
          </div>
          <div className="song-timer">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
      <div className="winamp-controls">
        <button onClick={previousSong} className="winamp-button back-button">
          Back
        </button>
        <button onClick={togglePlayPause} className="winamp-button play-pause-button">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSong} className="winamp-button next-button">
          Next
        </button>
      </div>
      <audio ref={playerRef} src={songs[currentSong]} />
    </div>
  );
};

export default Mp3Player;