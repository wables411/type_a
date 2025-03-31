import React, { useEffect, useRef, useCallback, memo } from "react";
import Webamp from "webamp";

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const isRenderingRef = useRef(false);

  const WINDOW_DIMENSIONS = {
    main: { width: 275, height: 116 },
    equalizer: { width: 275, height: 58 },
    playlist: { width: 275, height: 174 },
  };

  const calculateInitialPositions = useCallback(
    (containerWidth) => {
      const mainX = (containerWidth - WINDOW_DIMENSIONS.main.width) / 2;
      const mainY = 0;
      console.log("Container width:", containerWidth, "Calculated mainX:", mainX);
      return {
        main: { x: 0, y: mainY },
        equalizer: { x: 0, y: mainY + WINDOW_DIMENSIONS.main.height },
        playlist: { x: 0, y: mainY + WINDOW_DIMENSIONS.main.height + WINDOW_DIMENSIONS.equalizer.height },
      };
    },
    [
      WINDOW_DIMENSIONS.main.width,
      WINDOW_DIMENSIONS.main.height,
      WINDOW_DIMENSIONS.equalizer.height,
    ]
  );

  const positionsRef = useRef(calculateInitialPositions(600));

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      console.log("Actual container width on mount:", containerWidth);
      positionsRef.current = calculateInitialPositions(containerWidth);
    }
  }, [
    calculateInitialPositions,
    WINDOW_DIMENSIONS.main.width,
    WINDOW_DIMENSIONS.main.height,
    WINDOW_DIMENSIONS.equalizer.height,
  ]);

  useEffect(() => {
    localStorage.removeItem("webampWindowPositions");
    console.log("Cleared webampWindowPositions from localStorage");
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
      initialLayout: {
        main: { x: 0, y: 0 },
        equalizer: { x: 0, y: WINDOW_DIMENSIONS.main.height },
        playlist: { x: 0, y: WINDOW_DIMENSIONS.main.height + WINDOW_DIMENSIONS.equalizer.height },
      },
    });

    webampRef.current = webampInstance;

    // Set up observer before rendering
    let observer;
    const setupObserver = () => {
      const webampElement = document.querySelector("#webamp");
      if (webampElement) {
        console.log("Observer setup, initial left:", webampElement.style.left, "x:", webampElement.getBoundingClientRect().x);
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === "style") {
              const left = webampElement.style.left;
              const currentX = webampElement.getBoundingClientRect().x;
              console.log("Mutation detected, left:", left, "x:", currentX);
              if (left !== "50%") {
                webampElement.style.left = "50%";
                webampElement.style.transform = "translateX(-50%)";
                console.log("Reset left to 50%, new x:", webampElement.getBoundingClientRect().x);
              }
            }
          });
        });
        observer.observe(webampElement, { attributes: true, attributeFilter: ["style"] });
      } else {
        console.log("Webamp element not found for observer");
      }
    };

    isRenderingRef.current = true;
    webampInstance.renderWhenReady(containerRef.current).then(() => {
      isRenderingRef.current = false;
      console.log("Webamp rendered successfully with custom skin");

      const webampElement = document.querySelector("#webamp");
      if (webampElement && webampElement.parentElement !== containerRef.current) {
        console.log("Moving #webamp from", webampElement.parentElement, "to container");
        containerRef.current.appendChild(webampElement);
      }

      if (webampElement) {
        console.log("Before forcing center, left:", webampElement.style.left, "x:", webampElement.getBoundingClientRect().x);
        webampElement.style.left = "50%";
        webampElement.style.transform = "translateX(-50%)";
        webampElement.style.position = "absolute";
        console.log("Forced Webamp position to center post-render, x:", webampElement.getBoundingClientRect().x);
      }

      console.log("Webamp x position post-render:", webampElement?.getBoundingClientRect().x);
      setupObserver(); // Attach observer after render
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
      }
      if (observer) observer.disconnect();
    };
  }, [WINDOW_DIMENSIONS.main.width, WINDOW_DIMENSIONS.main.height, WINDOW_DIMENSIONS.equalizer.height]);

  useEffect(() => {
    if (!webampRef.current) return;

    const mainWindow = document.querySelector("#webamp #main-window");
    const equalizerWindow = document.querySelector("#webamp #equalizer-window");
    const playlistWindow = document.querySelector("#webamp #playlist-window");

    if (mainWindow && equalizerWindow && playlistWindow) {
      const updatePositions = () => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const mainRect = mainWindow.getBoundingClientRect();
        const equalizerRect = equalizerWindow.getBoundingClientRect();
        const playlistRect = playlistWindow.getBoundingClientRect();

        positionsRef.current = {
          main: { x: 0, y: mainRect.top - containerRect.top },
          equalizer: { x: 0, y: equalizerRect.top - containerRect.top },
          playlist: { x: 0, y: playlistRect.top - containerRect.top },
        };
        localStorage.setItem("webampWindowPositions", JSON.stringify(positionsRef.current));
      };

      document.addEventListener("mousemove", updatePositions);
      return () => document.removeEventListener("mousemove", updatePositions);
    }
  }, []);

  return (
    <div className="mp3-player">
      <div ref={containerRef} className="webamp-container" />
    </div>
  );
};

export default memo(Mp3Player);