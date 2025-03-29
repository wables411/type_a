import React, { useEffect, useRef, memo } from 'react';
import Webamp from 'webamp';

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const isRenderingRef = useRef(false);
  const [renderKey, setRenderKey] = React.useState(0);
  const [renderFailed, setRenderFailed] = React.useState(false);

  // Load initial window positions from localStorage or use defaults
  const [windowPositions, setWindowPositions] = React.useState(() => {
    const savedPositions = localStorage.getItem('webampWindowPositions');
    return savedPositions
      ? JSON.parse(savedPositions)
      : {
          main: { x: 0, y: 0 },
          equalizer: { x: 0, y: 116 },
          playlist: { x: 275, y: 0 },
        };
  });
  const maxRetries = 3;
  const retryCountRef = useRef(0);

  useEffect(() => {
    console.log('Mp3Player useEffect running, renderKey:', renderKey);
    isMountedRef.current = true;

    if (webampRef.current) {
      console.log('Webamp already initialized, skipping');
      return;
    }

    if (!containerRef.current) {
      console.log('Container ref not available, skipping');
      return;
    }

    const songs = [
      { url: '/assets/lovestory.mp3', metaData: { title: 'Love Story' } },
      { url: '/assets/mononoaware.mp3', metaData: { title: 'Mononoaware' } },
      { url: '/assets/BITCH_I_DID-THE.RACE.mp3', metaData: { title: 'BITCH I DID THE RACE' } },
      { url: '/assets/DESTRUCTION.mp3', metaData: { title: 'Destruction' } },
      { url: '/assets/dqdvTSDlaMKx.mp3', metaData: { title: 'dqdvTSDlaMKx' } },
      { url: '/assets/exorcism.mp3', metaData: { title: 'Exorcism' } },
      { url: '/assets/Heart Of Stone.mp3', metaData: { title: 'Heart of Stone' } },
      { url: '/assets/long day.mp3', metaData: { title: 'Long Day' } },
      { url: '/assets/cloud.mp3', metaData: { title: 'Cloud' } },
      { url: '/assets/recipie for a femcel (boxxy f4g V2).mp3', metaData: { title: 'Recipe for a Femcel (Boxxy F4g V2)' } },
    ];

    // Test audio file accessibility
    songs.forEach((song) => {
      fetch(song.url)
        .then((response) => {
          if (!response.ok) {
            console.error(`Failed to load audio file: ${song.url}, status: ${response.status}`);
          } else {
            console.log(`Audio file accessible: ${song.url}`);
          }
        })
        .catch((error) => {
          console.error(`Error fetching audio file: ${song.url}`, error);
        });
    });

    console.log('Initializing Webamp');
    const webampInstance = new Webamp({
      initialTracks: songs,
      initialSkin: {
        url: '/assets/Initial_D_Honda_Civic.wsz',
      },
      enableHotkeys: true,
      initialWindowLayout: windowPositions,
      __initialWindowLayout: windowPositions,
    });

    webampRef.current = webampInstance;

    console.log('Webamp instance:', webampInstance);
    console.log('Webamp instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(webampInstance)));

    if (isMountedRef.current) {
      isRenderingRef.current = true;
      webampInstance.renderWhenReady(containerRef.current).then(() => {
        isRenderingRef.current = false;
        console.log('Webamp rendered successfully with custom skin');
        if (containerRef.current) {
          console.log('Webamp container children:', containerRef.current.children);
          console.log('Webamp container parent:', containerRef.current.parentElement);
        }
        const webampElements = document.querySelectorAll('#webamp');
        console.log('Webamp DOM elements:', webampElements);

        // Track window positions by inspecting DOM elements
        const mainWindow = document.querySelector('#webamp #main-window');
        const equalizerWindow = document.querySelector('#webamp #equalizer-window');
        const playlistWindow = document.querySelector('#webamp #playlist-window');

        if (mainWindow && equalizerWindow && playlistWindow) {
          const updatePositions = () => {
            const mainRect = mainWindow.getBoundingClientRect();
            const equalizerRect = equalizerWindow.getBoundingClientRect();
            const playlistRect = playlistWindow.getBoundingClientRect();

            const newPositions = {
              main: { x: mainRect.left, y: mainRect.top },
              equalizer: { x: equalizerRect.left, y: equalizerRect.top },
              playlist: { x: playlistRect.left, y: playlistRect.top },
            };

            // Update state and save to localStorage
            setWindowPositions(newPositions);
            localStorage.setItem('webampWindowPositions', JSON.stringify(newPositions));
          };

          // Update positions on mousemove (proxy for drag events)
          document.addEventListener('mousemove', updatePositions);

          // Clean up the event listener when Webamp is disposed
          webampRef.current.__cleanup = () => {
            document.removeEventListener('mousemove', updatePositions);
          };
        } else {
          console.error('Webamp windows not found in DOM');
        }

        // Debug playback by simulating a click on the play button
        setTimeout(() => {
          const playButton = document.querySelector('#webamp #play');
          if (playButton) {
            console.log('Play button found, simulating click');
            playButton.click();
          } else {
            console.error('Play button not found in Webamp DOM');
          }
        }, 1000); // Wait 1 second to ensure Webamp is fully rendered

        retryCountRef.current = 0;
        setRenderFailed(false);
      }).catch((error) => {
        isRenderingRef.current = false;
        console.error('Error rendering Webamp:', error);
        if (isMountedRef.current && retryCountRef.current < maxRetries) {
          console.log('Retrying Webamp render, attempt:', retryCountRef.current + 1);
          retryCountRef.current += 1;
          setRenderKey((prev) => prev + 1);
        } else if (retryCountRef.current >= maxRetries) {
          console.error('Max retries reached, stopping Webamp render attempts');
          setRenderFailed(true);
        }
      });
    }

    return () => {
      console.log('Cleaning up Webamp');
      isMountedRef.current = false;

      if (webampRef.current && !isRenderingRef.current) {
        try {
          if (webampRef.current.__cleanup) {
            webampRef.current.__cleanup();
          }
          webampRef.current.dispose();
          console.log('Webamp disposed successfully');
        } catch (error) {
          console.error('Error disposing Webamp:', error);
        }
        webampRef.current = null;
      } else if (isRenderingRef.current) {
        console.log('Webamp rendering in progress, delaying disposal');
      }
    };
  }, [renderKey, windowPositions]);

  if (renderFailed) {
    return (
      <div className="mp3-player">
        <p>Failed to load music player after multiple attempts. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="mp3-player">
      <div ref={containerRef} style={{ width: '100%', height: '300px', position: 'relative' }} />
    </div>
  );
};

export default memo(Mp3Player);