import { useEffect, useRef, useMemo, useState } from "react";
import Webamp from "webamp";
import "./Mp3Player.css";

const Mp3Player = ({ className = "" }) => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const applyMobileInFlowLayout = () => {
    if (typeof document === "undefined" || !isMobile || !containerRef.current) {
      return;
    }

    const roots = Array.from(
      containerRef.current.querySelectorAll("div[data-webamp-root]")
    );
    if (!roots.length) {
      return;
    }

    let tallestRoot = 0;
    const containerRect = containerRef.current.getBoundingClientRect();
    roots.forEach((root) => {
      // Ensure all Webamp roots stay attached to this section in mobile flow.
      if (root.parentElement !== containerRef.current) {
        containerRef.current.appendChild(root);
      }

      let measuredHeight = Math.ceil(root.getBoundingClientRect().height || 0);
      const descendants = root.querySelectorAll("*");
      descendants.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const bottomOffset = Math.ceil(rect.bottom - containerRect.top);
        measuredHeight = Math.max(measuredHeight, bottomOffset);
      });
      tallestRoot = Math.max(tallestRoot, measuredHeight);
    });

    if (tallestRoot > 0) {
      // Keep enough reserved vertical space so Webamp never climbs over chat on mobile.
      const minMobileHeight = 560;
      containerRef.current.style.minHeight = `${Math.max(tallestRoot + 16, minMobileHeight)}px`;
    }
  };

  const skins = useMemo(() => [
    { name: "Kaori Amp 2", url: "/assets/skins/1Kaori_Amp_2.wsz" },
    { name: "Akira - Kaneda", url: "/assets/skins/Akira - Kaneda.wsz" },
    { name: "Angel Beats! Amp", url: "/assets/skins/Angel_Beats!_Amp.wsz" },
    { name: "Asuna Yuuki by Runa", url: "/assets/skins/Asuna Yuuki by Runa.wsz" },
    { name: "Bleach - Rukia", url: "/assets/skins/Bleach - Rukia.wsz" },
    { name: "Bleach - Senbonzakura", url: "/assets/skins/Bleach - Senbonzakura.wsz" },
    { name: "Chobits - Pearls", url: "/assets/skins/Chobits - Pearls.wsz" },
    { name: "Eternal Sailor Moon with Wings", url: "/assets/skins/Eternal_Sailor_Moon_with_Wings.wsz" },
    { name: "Fruits Basket - Tooru is the Onigiri!", url: "/assets/skins/Fruits Basket - Tooru is the Onigiri!.wsz" },
    { name: "Full Metal Alchemist - Slight Return", url: "/assets/skins/Full Metal Alchemist - Slight Return.wsz" },
    { name: "Ghost in the Shell", url: "/assets/skins/Ghost_in_the_shell.wsz" },
    { name: "Initial D - Red Suns", url: "/assets/skins/Initial_D_-_Red_Suns.wsz" },
    { name: "Initial D Honda Civic", url: "/assets/skins/Initial_D_Honda_Civic.wsz" },
    { name: "Kingdom Hearts II Final Mix - Sanctuary", url: "/assets/skins/Kingdom Hearts II Final Mix - Sanctuary.wsz" },
    { name: "Lain Bear 2", url: "/assets/skins/Lain Bear 2.wsz" },
    { name: "Legend of Zelda - Hylians Nocturne Link", url: "/assets/skins/Legend of Zelda - Hylians Nocturne Link.wsz" },
    { name: "Legend of Zelda", url: "/assets/skins/Legend_of_Zelda.wsz" },
    { name: "Lucky Star by M-nebell", url: "/assets/skins/Lucky Star by M-nebell.wsz" },
    { name: "Mew Bubble Skin", url: "/assets/skins/Mew_Bubble_Skin.wsz" },
    { name: "My Rei in Blue", url: "/assets/skins/My_Rei_in_Blue.wsz" },
    { name: "Naruto - 4th Hokage Wild Wind", url: "/assets/skins/Naruto - 4th Hokage Wild Wind.wsz" },
    { name: "Skyline GTR", url: "/assets/skins/Skyline_GTR.wsz" },
    { name: "FLCL - Again", url: "/assets/skins/flcl_-_again.wsz" },
    { name: "Bleach - Orihime Tatsuki", url: "/assets/skins/Bleach - Orihime Tatsuki -remake.wsz" },
  ], []);

  const tracks = useMemo(() => [
    { metaData: { artist: "Unknown", title: "ReoNa" }, url: "/assets/audio/ ANIMA - ReoNa.mp3" },
    { metaData: { artist: "Unknown", title: "DOGFIGHT" }, url: "/assets/audio/M.O.V.E - DOGFIGHT (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "again" }, url: "/assets/audio/again - YUI.mp3" },
    { metaData: { artist: "Unknown", title: "Aqua Timez" }, url: "/assets/audio/ALONES - Aqua Timez.mp3" },
    { metaData: { artist: "Unknown", title: "LiSA" }, url: "/assets/audio/crossing field - LiSA.mp3" },
    { metaData: { artist: "Unknown", title: "Hikaru Utada" }, url: "/assets/audio/Face My Fears (English Version) - Hikaru Utada.mp3" },
    { metaData: { artist: "Unknown", title: "I Really Want to Stay at Your House" }, url: "/assets/audio/I Really Want to Stay at Your House - Rosa Walton.mp3" },
    { metaData: { artist: "Unknown", title: "TK from Ling tosite sigure" }, url: "/assets/audio/TK from Ling tosite sigure.mp3" },
    { metaData: { artist: "Unknown", title: "heavenly6" }, url: "/assets/audio/Tommy heavenly6.mp3" },
    { metaData: { artist: "Unknown", title: "BITCH I DID THE RACE" }, url: "/assets/audio/BITCH_I_DID-THE.RACE.mp3" },
    { metaData: { artist: "Unknown", title: "KANA-BOON" }, url: "/assets/audio/シルエット - KANA-BOON.mp3" },
    { metaData: { artist: "Unknown", title: "recipie for a femcel (boxxy f4g V2)" }, url: "/assets/audio/recipie for a femcel (boxxy f4g V2).mp3" },
    { metaData: { artist: "Unknown", title: "～架空～ Going My Way _ TEKONDO" }, url: "/assets/audio/～架空～ Going My Way _ TEKONDO.mp3" },
    { metaData: { artist: "Unknown", title: "spitfire" }, url: "/assets/audio/Go2 - Spitfire (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Around The World" }, url: "/assets/audio/M.O.V.E - Around The World (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "exorcism" }, url: "/assets/audio/exorcism.mp3" },
    { metaData: { artist: "Unknown", title: "Rage your dream" }, url: "/assets/audio/M.O.V.E - Rage your dream (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "chAngE" }, url: "/assets/audio/chAngE - miwa.mp3" },
    { metaData: { artist: "Unknown", title: "Strike On" }, url: "/assets/audio/M.O.V.E - Strike On.mp3" },
    { metaData: { artist: "Unknown", title: "Running in The 90s" }, url: "/assets/audio/Max Coveri- Running in The 90s ( Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Night Of Fire" }, url: "/assets/audio/Niko - Night Of Fire (Extended Mix) (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Rail Roader's Shooting Star" }, url: "/assets/audio/Rail Roader's Shooting Star _ かな.mp3" },
    { metaData: { artist: "Unknown", title: "A Cruel Angel's Thesis _Neon Genesis Evangelion" }, url: "/assets/audio/A Cruel Angel's Thesis _Neon Genesis Evangelion_ - Eurobeat Version - LMR Eurobeat.mp3" },
    { metaData: { artist: "Unknown", title: "lovestory" }, url: "/assets/audio/lovestory.mp3" },
    { metaData: { artist: "Unknown", title: "Superdance" }, url: "/assets/audio/Vicky Vale - Superdance (Extended Mix).mp3" },
    { metaData: { artist: "Unknown", title: "DESTRUCTION" }, url: "/assets/audio/DESTRUCTION.mp3" },
    { metaData: { artist: "Unknown", title: "Heart Of Stone" }, url: "/assets/audio/Heart Of Stone.mp3" },
    { metaData: { artist: "Unknown", title: "cloud" }, url: "/assets/audio/cloud.mp3" },
    { metaData: { artist: "Unknown", title: "dqdvTSDlaMKx" }, url: "/assets/audio/dqdvTSDlaMKx.mp3" },
    { metaData: { artist: "Unknown", title: "long day" }, url: "/assets/audio/long day.mp3" },
    { metaData: { artist: "Unknown", title: "BREAK IN2 THE NITE" }, url: "/assets/audio/M.O.V.E - BREAK IN2 THE NITE (Dave Rodgers Remix).mp3" },
    { metaData: { artist: "Unknown", title: "No One Sleep In Tokyo" }, url: "/assets/audio/Edo Boys - No One Sleep In Tokyo.mp3" },
    { metaData: { artist: "Unknown", title: "mononoaware" }, url: "/assets/audio/mononoaware.mp3" },
  ], []);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMobile) {
      return undefined;
    }

    const rootStyle = document.documentElement.style;
    const updateMobileBuffer = () => {
      const viewport = window.visualViewport;
      const chromeHeight = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0;
      const buffer = Math.ceil(chromeHeight + 160);
      rootStyle.setProperty("--mobile-webamp-bottom-buffer", `${buffer}px`);
    };

    updateMobileBuffer();
    window.addEventListener("resize", updateMobileBuffer);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateMobileBuffer);
      window.visualViewport.addEventListener("scroll", updateMobileBuffer);
    }

    return () => {
      window.removeEventListener("resize", updateMobileBuffer);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateMobileBuffer);
        window.visualViewport.removeEventListener("scroll", updateMobileBuffer);
      }
      rootStyle.removeProperty("--mobile-webamp-bottom-buffer");
    };
  }, [isMobile]);

  useEffect(() => {
    let isCancelled = false;
    let mediaSessionCleanup = null;
    let mediaSessionPoll = null;
    let mobileLayoutTimeout = null;

    const attachMediaSession = () => {
      if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
        return null;
      }

      const root = containerRef.current || document;
      const audio = root.querySelector("audio");
      if (!audio) {
        return null;
      }

      audio.setAttribute("playsinline", "true");
      audio.setAttribute("preload", "auto");

      if ("MediaMetadata" in window) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: "Milady Type A Radio",
          artist: "Milady Type A",
          album: "Webamp Playlist",
        });
      }

      const updatePlaybackState = () => {
        navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
      };

      const safePlay = () => {
        audio.play().catch(() => {});
      };

      const safePause = () => {
        audio.pause();
      };

      navigator.mediaSession.setActionHandler("play", safePlay);
      navigator.mediaSession.setActionHandler("pause", safePause);
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 10);
      });

      audio.addEventListener("play", updatePlaybackState);
      audio.addEventListener("pause", updatePlaybackState);
      audio.addEventListener("ended", updatePlaybackState);
      updatePlaybackState();

      return () => {
        audio.removeEventListener("play", updatePlaybackState);
        audio.removeEventListener("pause", updatePlaybackState);
        audio.removeEventListener("ended", updatePlaybackState);
        navigator.mediaSession.playbackState = "none";
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
      };
    };

    const initializeWebamp = async () => {
      if (isMountedRef.current || isCancelled || !containerRef.current) {
        console.log('Webamp skipped: already mounted, cancelled, or no container');
        return;
      }

      try {
        // Remove stale roots before creating a new instance, which prevents
        // invisible overlapped layers from intercepting mobile taps.
        containerRef.current
          .querySelectorAll("div[data-webamp-root]")
          .forEach((node) => node.remove());
        document
          .querySelectorAll("div[data-webamp-root]")
          .forEach((node) => {
            if (!containerRef.current?.contains(node)) {
              node.remove();
            }
          });

        console.log('Webamp constructor:', Webamp);
        console.log('Container element:', containerRef.current);
        const webamp = new Webamp({
          initialTracks: tracks,
          initialSkin: { url: skins[0].url },
          availableSkins: skins,
          __initialWindowLayout: {
            main: { position: { x: 0, y: 0 } },
            equalizer: { position: { x: 0, y: 116 } },
            playlist: { position: { x: 0, y: 232 } },
          },
        });
        webampRef.current = webamp;
        isMountedRef.current = true;

        console.log('Rendering Webamp into container...');
        await webamp.renderWhenReady(containerRef.current);
        console.log('Webamp rendered successfully');
        if (isMobile) {
          applyMobileInFlowLayout();
          mobileLayoutTimeout = window.setTimeout(() => {
            if (!isCancelled) {
              applyMobileInFlowLayout();
            }
          }, 250);
        }

        mediaSessionCleanup = attachMediaSession();
        if (!mediaSessionCleanup) {
          let attempts = 0;
          mediaSessionPoll = window.setInterval(() => {
            if (isCancelled) {
              window.clearInterval(mediaSessionPoll);
              mediaSessionPoll = null;
              return;
            }
            attempts += 1;
            mediaSessionCleanup = attachMediaSession();
            if (mediaSessionCleanup || attempts >= 20) {
              window.clearInterval(mediaSessionPoll);
              mediaSessionPoll = null;
            }
          }, 500);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Webamp render failed:", err);
          setError(err);
        }
      }
    };

    console.log('Mp3Player useEffect running');
    initializeWebamp();

    return () => {
      isCancelled = true;
      if (mobileLayoutTimeout) {
        window.clearTimeout(mobileLayoutTimeout);
        mobileLayoutTimeout = null;
      }
      if (mediaSessionPoll) {
        window.clearInterval(mediaSessionPoll);
        mediaSessionPoll = null;
      }
      if (mediaSessionCleanup) {
        mediaSessionCleanup();
        mediaSessionCleanup = null;
      }
      if (webampRef.current && isMountedRef.current) {
        try {
          webampRef.current.dispose();
        } catch (err) {
          console.error("Webamp dispose failed:", err);
        }
        webampRef.current = null;
        isMountedRef.current = false;
      }
      if (containerRef.current) {
        containerRef.current.style.minHeight = "";
      }
    };
  }, [isMobile, skins, tracks]);

  useEffect(() => {
    if (!isMobile || typeof window === "undefined") {
      return undefined;
    }

    const handleLayoutRefresh = () => {
      applyMobileInFlowLayout();
    };

    applyMobileInFlowLayout();
    window.addEventListener("resize", handleLayoutRefresh);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleLayoutRefresh);
    }

    return () => {
      window.removeEventListener("resize", handleLayoutRefresh);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleLayoutRefresh);
      }
    };
  }, [isMobile]);

  if (error) {
    throw error;
  }

  const containerClassName = ["webamp-container", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={containerClassName} />
  );
};

export default Mp3Player;