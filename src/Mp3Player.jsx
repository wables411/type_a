import { useEffect, useRef, useMemo, useState } from "react";
import Webamp from "webamp";
import "./Mp3Player.css";

const Mp3Player = () => {
  const webampRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);
  const [error, setError] = useState(null);

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
    { metaData: { artist: "Unknown", title: "A Cruel Angel's Thesis _Neon Genesis Evangelion" }, url: "/assets/audio/A Cruel Angel's Thesis _Neon Genesis Evangelion_ - Eurobeat Version - LMR Eurobeat.mp3" },
    { metaData: { artist: "Unknown", title: "again" }, url: "/assets/audio/again - YUI.mp3" },
    { metaData: { artist: "Unknown", title: "Aqua Timez" }, url: "/assets/audio/ALONES - Aqua Timez.mp3" },
    { metaData: { artist: "Unknown", title: "LiSA" }, url: "/assets/audio/crossing field - LiSA.mp3" },
    { metaData: { artist: "Unknown", title: "Hikaru Utada" }, url: "/assets/audio/Face My Fears (English Version) - Hikaru Utada.mp3" },
    { metaData: { artist: "Unknown", title: "I Really Want to Stay at Your House" }, url: "/assets/audio/I Really Want to Stay at Your House - Rosa Walton.mp3" },
    { metaData: { artist: "Unknown", title: "TK from Ling tosite sigure" }, url: "/assets/audio/TK from Ling tosite sigure.mp3" },
    { metaData: { artist: "Unknown", title: "heavenly6" }, url: "/assets/audio/Tommy heavenly6.mp3" },
    { metaData: { artist: "Unknown", title: "KANA-BOON" }, url: "/assets/audio/シルエット - KANA-BOON.mp3" },
    { metaData: { artist: "Unknown", title: "～架空～ Going My Way _ TEKONDO" }, url: "/assets/audio/～架空～ Going My Way _ TEKONDO.mp3" },
    { metaData: { artist: "Unknown", title: "No One Sleep In Tokyo" }, url: "/assets/audio/Edo Boys - No One Sleep In Tokyo.mp3" },
    { metaData: { artist: "Unknown", title: "spitfire" }, url: "/assets/audio/Go2 - Spitfire (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Around The World" }, url: "/assets/audio/M.O.V.E - Around The World (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "BREAK IN2 THE NITE" }, url: "/assets/audio/M.O.V.E - BREAK IN2 THE NITE (Dave Rodgers Remix).mp3" },
    { metaData: { artist: "Unknown", title: "DOGFIGHT" }, url: "/assets/audio/M.O.V.E - DOGFIGHT (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Rage your dream" }, url: "public/assets/audio/M.O.V.E - Rage your dream (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Strike On" }, url: "/assets/audio/M.O.V.E - Strike On.mp3" },
    { metaData: { artist: "Unknown", title: "Running in The 90s" }, url: "/assets/audio/Max Coveri- Running in The 90s ( Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Night Of Fire" }, url: "/assets/audio/Niko - Night Of Fire (Extended Mix) (Initial D).mp3" },
    { metaData: { artist: "Unknown", title: "Rail Roader's Shooting Star" }, url: "/assets/audio/Rail Roader's Shooting Star _ かな.mp3" },
    { metaData: { artist: "Unknown", title: "Superdance" }, url: "/assets/audio/Vicky Vale - Superdance (Extended Mix).mp3" },
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
      if (isMountedRef.current || isCancelled || !containerRef.current) {
        console.log('Webamp skipped: already mounted, cancelled, or no container');
        return;
      }

      try {
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

        // Check for Webamp root in container
        const rootInContainer = containerRef.current.querySelector('div[data-webamp-root]');
        if (rootInContainer) {
          console.log('Webamp root size in container:', {
            width: rootInContainer.offsetWidth,
            height: rootInContainer.offsetHeight,
          });
        } else {
          console.log('No div[data-webamp-root] in container');
          // Check entire DOM
          const rootInDom = document.querySelector('div[data-webamp-root]');
          if (rootInDom) {
            console.log('Found div[data-webamp-root] elsewhere in DOM:', rootInDom);
            console.log('Webamp root size in DOM:', {
              width: rootInDom.offsetWidth,
              height: rootInDom.offsetHeight,
            });
          } else {
            console.log('No div[data-webamp-root] anywhere in DOM');
          }
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