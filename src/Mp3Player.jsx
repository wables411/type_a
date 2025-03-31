import { useEffect, useRef, useMemo } from "react";
import Webamp from "webamp";
import "./Mp3Player.css";

const Mp3Player = () => {
  const webampRef = useRef(null); // Store Webamp instance

  // Memoized skins array (stable reference, doesn’t change on re-renders)
  const skins = useMemo(() => [
    { name: "Akira - Kaneda", url: "/assets/skins/Akira - Kaneda.wsz" },
    { name: "Angel Beats! Amp", url: "/assets/skins/Angel_Beats!_Amp.wsz" },
    { name: "Asuna Yuuki by Runa", url: "/assets/skins/Asuna Yuuki by Runa.wsz" },
    { name: "Bleach - Rukia", url: "/assets/skins/Bleach - Rukia.wsz" },
    { name: "Bleach - Senbonzakura", url: "/assets/skins/Bleach - Senbonzakura.wsz" },
    { name: "Chobits - Pearls", url: "/assets/skins/Chobits - Pearls.wsz" },
    { name: "Death Note - Misa", url: "/assets/skins/Death Note - Misa.zip" }, // Note: .zip, may need to be .wsz
    { name: "Eternal Sailor Moon with Wings", url: "/assets/skins/Eternal_Sailor_Moon_with_Wings.wsz" },
    { name: "Fruits Basket - Tooru is the Onigiri!", url: "/assets/skins/Fruits Basket - Tooru is the Onigiri!.wsz" },
    { name: "Full Metal Alchemist - Slight Return", url: "/assets/skins/Full Metal Alchemist - Slight Return.wsz" },
    { name: "Ghost in the Shell", url: "/assets/skins/Ghost_in_the_shell.wsz" },
    { name: "Initial D - Red Suns", url: "/assets/skins/Initial_D_-_Red_Suns.wsz" },
    { name: "Initial D Honda Civic", url: "/assets/skins/Initial_D_Honda_Civic.wsz" },
    { name: "Kaori Amp 2", url: "/assets/skins/Kaori_Amp_2.wsz" },
    { name: "Kingdom Hearts II Final Mix - Sanctuary", url: "/assets/skins/Kingdom Hearts II Final Mix - Sanctuary.wsz" },
    { name: "Lain Bear 2", url: "/assets/skins/Lain Bear 2.wsz" },
    { name: "Laputa 1", url: "/assets/skins/Laputa_1.zip" }, // Note: .zip, may need to be .wsz
    { name: "Legend of Zelda - Hylians Nocturne Link", url: "/assets/skins/Legend of Zelda - Hylians Nocturne Link.wsz" },
    { name: "Legend of Zelda", url: "/assets/skins/Legend_of_Zelda.wsz" },
    { name: "Lucky Star by M-nebell", url: "/assets/skins/Lucky Star by M-nebell.wsz" },
    { name: "Mew Bubble Skin", url: "/assets/skins/Mew_Bubble_Skin.wsz" },
    { name: "My Rei in Blue", url: "/assets/skins/My_Rei_in_Blue.wsz" },
    { name: "Naruto - 4th Hokage Wild Wind", url: "/assets/skins/Naruto - 4th Hokage Wild Wind.wsz" },
    { name: "Skyline GTR", url: "/assets/skins/Skyline_GTR.wsz" },
    { name: "Celebi", url: "/assets/skins/celebi.wsz" },
    { name: "FLCL - Again", url: "/assets/skins/flcl_-_again.wsz" },
    { name: "Setsuna Gundam 00 by Rain Sprite", url: "/assets/skins/setsuna___gundam_00_by_rain_sprite.zip" }, // Note: .zip, may need to be .wsz
  ], []); // Empty deps: memoizes once on mount

  // Memoized tracks array (stable reference, doesn’t change on re-renders)
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
  ], []); // Empty deps: memoizes once on mount

  useEffect(() => {
    if (!webampRef.current) {
      const webamp = new Webamp({
        initialTracks: tracks,
        initialSkin: { url: skins[0].url }, // Default skin: Akira - Kaneda
        availableSkins: skins,
      });
      webampRef.current = webamp;
      webamp.renderWhenReady(document.getElementById("webamp"));
    }

    return () => {
      if (webampRef.current) {
        webampRef.current.dispose();
        webampRef.current = null;
      }
    };
  }, [skins, tracks]); // Dependencies satisfied with memoized values

  return (
    <div className="mp3-player-wrapper">
      <div id="webamp" />
    </div>
  );
};

export default Mp3Player;