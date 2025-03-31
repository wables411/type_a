import { useEffect, useState } from "react";
import Webamp from "webamp";
import "./Mp3Player.css";

const Mp3Player = () => {
  const [webampInstance, setWebampInstance] = useState(null);

  const skins = [
    { name: "Base Skin", url: "/assets/skins/base-2.91.wsz" },
    { name: "Rei Blue", url: "/assets/skins/rei_blue.wsz" },
  ];

  useEffect(() => {
    const webamp = new Webamp({
      initialTracks: [
        {
          metaData: {
            artist: "DJ Mike Llama",
            title: "Llama Whippin' Intro",
          },
          url: "/assets/audio/llama.mp3",
        },
      ],
      initialSkin: { url: skins[0].url },
    });

    webamp.renderWhenReady(document.getElementById("webamp"));
    setWebampInstance(webamp);

    return () => {
      webamp.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array = runs once on mount

  const handleSkinChange = (event) => {
    const skinUrl = event.target.value;
    if (webampInstance) {
      webampInstance.setSkinFromUrl(skinUrl);
    }
  };

  return (
    <div className="mp3-player-wrapper">
      <div id="webamp" />
      <select onChange={handleSkinChange} className="skin-picker">
        {skins.map((skin) => (
          <option key={skin.url} value={skin.url}>
            {skin.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Mp3Player;