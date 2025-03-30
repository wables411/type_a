import React, { useEffect, useRef, memo } from "react";
import Webamp from "webamp";

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const isRenderingRef = useRef(false);
  const positionsRef = useRef({
    main: { x: 112, y: 0 }, // Center ~275px wide main window in 500px container (500-275)/2 ≈ 112
    equalizer: { x: 112, y: 116 }, // Below main window
    playlist: { x: 112, y: 232 }, // Below equalizer (adjust based on skin height)
  });

  // Load initial window positions from localStorage
  useEffect(() => {
    const savedPositions = localStorage.getItem("webampWindowPositions");
    if (savedPositions) {
      positionsRef.current = JSON.parse(savedPositions);
    }
  }, []);

  // Main Webamp initialization
  useEffect(() => {
    console.log("Mp3Player useEffect running");
    isMountedRef.current = true;

    if (webampRef.current || !containerRef.current) {
      console.log("Webamp already initialized or container not ready, skipping");
      return;
    }

    const songs = [
      { url: "/assets/lovestory.mp3", metaData: { title: "Love Story" } },
      { url: "/assets/mononoaware.mp3", metaData: { title: "Mononoaware" } },
      { url: "/assets/BITCH_I_DID-THE.RACE.mp3", metaData: { title: "BITCH I DID THE RACE" } },
      { url: "/assets/DESTRUCTION.mp3", metaData: { title: "Destruction" } },
      { url: "/assets/dqdvTSDlaMKx.mp3", metaData: { title: "dqdvTSDlaMKx" } },
      { url: "/assets/exorcism.mp3", metaData: { title: "Exorcism" } },
      { url: "/assets/Heart Of Stone.mp3", metaData: { title: "Heart of Stone" } },
      { url: "/assets/long day.mp3", metaData: { title: "Long Day" } },
      { url: "/assets/cloud.mp3", metaData: { title: "Cloud" } },
      { url: "/assets/recipie for a femcel (boxxy f4g V2).mp3", metaData: { title: "Recipe for a Femcel (Boxxy F4g V2)" } },
    ];

    songs.forEach((song) => {
      fetch(song.url)
        .then((_response) => console.log(`Audio file accessible: ${song.url}`))
        .catch((error) => console.error(`Error fetching audio file: ${song.url}`, error));
    });

    const webampInstance = new Webamp({
      initialTracks: songs,
      initialSkin: { url: "/assets/Initial_D_Honda_Civic.wsz" },
      enableHotkeys: true,
      initialWindowLayout: positionsRef.current,
      __initialWindowLayout: positionsRef.current,
    });

    webampRef.current = webampInstance;

    if (isMountedRef.current) {
      isRenderingRef.current = true;
      webampInstance.renderWhenReady(containerRef.current).then(() => {
        isRenderingRef.current = false;
        console.log("Webamp rendered successfully with custom skin");
      }).catch((error) => {
        isRenderingRef.current = false;
        console.error("Error rendering Webamp:", error);
      });
    }

    return () => {
      console.log("Cleaning up Webamp");
      isMountedRef.current = false;
      if (webampRef.current && !isRenderingRef.current) {
        webampRef.current.dispose();
        console.log("Webamp disposed successfully");
        webampRef.current = null;
      }
    };
  }, []);

  // Window position tracking
  useEffect(() => {
    if (!webampRef.current) return;

    const mainWindow = document.querySelector("#webamp #main-window");
    const equalizerWindow = document.querySelector("#webamp #equalizer-window");
    const playlistWindow = document.querySelector("#webamp #playlist-window");

    if (mainWindow && equalizerWindow && playlistWindow) {
      const updatePositions = () => {
        const mainRect = mainWindow.getBoundingClientRect();
        const equalizerRect = equalizerWindow.getBoundingClientRect();
        const playlistRect = playlistWindow.getBoundingClientRect();

        positionsRef.current = {
          main: { x: mainRect.left, y: mainRect.top },
          equalizer: { x: equalizerRect.left, y: equalizerRect.top },
          playlist: { x: playlistRect.left, y: playlistRect.top },
        };
        localStorage.setItem("webampWindowPositions", JSON.stringify(positionsRef.current));
      };

      document.addEventListener("mousemove", updatePositions);
      return () => document.removeEventListener("mousemove", updatePositions);
    }
  }, []);

  const handlePlay = () => {
    if (webampRef.current) {
      webampRef.current.play();
    }
  };

  return (
    <div className="mp3-player">
      <div ref={containerRef} style={{ width: "100%", height: "300px", position: "relative" }} />
      <button onClick={handlePlay} style={{ marginTop: "10px" }}>Play Music</button>
    </div>
  );
};

export default memo(Mp3Player);