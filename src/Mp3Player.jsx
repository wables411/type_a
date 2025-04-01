import { useEffect, useRef, useMemo, useState } from "react";
import Webamp from "webamp";
import "./Mp3Player.css";

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null); // Ref for Webamp container
  const isMountedRef = useRef(false);
  const [error, setError] = useState(null);

  const skins = useMemo(() => [
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
    { name: "Kaori Amp 2", url: "/assets/skins/Kaori_Amp_2.wsz" },
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
    { metaData: { artist: "Unknown", title: "BITCH I DID THE RACE" }, url: "/assets/audio/BITCH_I_DID-THE.RACE.mp3" },
    { metaData: { artist: "Unknown", title: "DESTRUCTION" }, url: "/assets/audio/DESTRUCTION.mp3" },
    { metaData: { artist: "Unknown", title: "Heart Of Stone" }, url: "/assets/audio/Heart Of Stone.mp3" },
    { metaData: { artist: "Unknown", title: "cloud" }, url: "/assets/audio/cloud.mp3" },
    { metaData: { artist: "Unknown", title: "dqdvTSDlaMKx" }, url: "/assets/audio/dqdvTSDlaMKx.mp3" },
    { metaData: { artist: "Unknown", title: "exorcism" }, url: "/assets/audio/exorcism.mp3" },
    { metaData: { artist: "Unknown", title: "long day" }, url: "/assets/audio/long day.mp3" },
    { metaData: { artist: "Unknown", title: "lovestory" }, url: "/assets/audio/lovestory.mp3" },
    { metaData: { artist: "Unknown", title: "mononoaware" }, url: "/assets/audio/mononoaware.mp3" },
    { metaData: { artist: "Unknown", title: "recipie for a femcel (boxxy f4g V2)" }, url: "/assets/audio/recipie for a femcel (boxxy f4g V2).mp3" },
  ], []);

  useEffect(() => {
    let isCancelled = false;

    const initializeWebamp = async () => {
      if (isMountedRef.current || isCancelled || !containerRef.current) return;

      try {
        const webamp = new Webamp({
          initialTracks: tracks,
          initialSkin: { url: skins[0].url },
          availableSkins: skins,
        });
        webampRef.current = webamp;
        isMountedRef.current = true;

        await webamp.renderWhenReady(containerRef.current);
      } catch (err) {
        if (!isCancelled) {
          console.error("Webamp render failed:", err);
          setError(err);
        }
      }
    };

    initializeWebamp();

    return () => {
      isCancelled = true;
      if (webampRef.current && isMountedRef.current) {
        try {
          webampRef.current.dispose();
        } catch (err) {
          console.error("Webamp dispose failed:", err);
        }
        webampRef.current = null;
        isMountedRef.current = false;
      }
    };
  }, [skins, tracks]);

  if (error) {
    throw error;
  }

  return <div ref={containerRef} className="webamp-container" />;
};

export default Mp3Player;