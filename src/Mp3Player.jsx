import React, { useEffect, useRef, memo } from "react";
import Webamp from "webamp";

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const isRenderingRef = useRef(false);
  const positionsRef = useRef({
    main: { x: 0, y: 0 },
    equalizer: { x: 275, y: 0 },
    playlist: { x: 0, y: 116 },
  });

  useEffect(() => {
    const savedPositions = localStorage.getItem("webampWindowPositions");
    if (savedPositions) {
      positionsRef.current = JSON.parse(savedPositions);
    }
  }, []);

  useEffect(() => {
    console.log("Mp3Player useEffect running");
    isMountedRef.current = true;

    if (webampRef.current) {
      console.log("Webamp already initialized, skipping");
      return;
    }

    if (!containerRef.current) {
      console.log("Container ref not available, skipping");
      return;
    }

    console.log("Container ref before render:", containerRef.current);

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

    isRenderingRef.current = true;
    webampInstance.renderWhenReady(containerRef.current).then(() => {
      isRenderingRef.current = false;
      console.log("Webamp rendered successfully with custom skin");
      console.log("Container ref after render:", containerRef.current);
      console.log("Webamp container children:", containerRef.current.children);
      console.log("Webamp DOM position:", document.querySelector("#webamp")?.getBoundingClientRect());
      console.log("Webamp parent:", document.querySelector("#webamp")?.parentElement);
    }).catch((error) => {
      isRenderingRef.current = false;
      console.error("Error rendering Webamp:", error);
    });

    return () => {
      console.log("Cleaning up Webamp, isRendering:", isRenderingRef.current);
      isMountedRef.current = false;
      if (webampRef.current && !isRenderingRef.current) {
        webampRef.current.dispose();
        console.log("Webamp disposed successfully");
        webampRef.current = null;
      } else if (isRenderingRef.current) {
        console.log("Webamp still rendering, disposal skipped");
      }
    };
  }, []);

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

  return (
    <div className="mp3-player">
      <div ref={containerRef} style={{ width: "100%", height: "400px", position: "relative" }} />
    </div>
  );
};

export default memo(Mp3Player);