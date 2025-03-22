import { useEffect, useState, useRef } from "react";
import { Layout, Row, Col, Button } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./index.css"; // Using index.css for styling

function App() {
  const [mintStatus, setMintStatus] = useState("coming_soon"); // Placeholder for mint status
  const [marqueePaused, setMarqueePaused] = useState(false); // State to toggle marquee animation
  const [isPlaying, setIsPlaying] = useState(false); // State to toggle play/pause, initially false
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // State to track current song
  const [hasInteracted, setHasInteracted] = useState(false); // State to track user interaction
  const audioRef = useRef<HTMLAudioElement>(null); // Ref to control the audio element

  // Playlist array with MP3 files and their display names
  const playlist = [
    { src: "/winamp/%231077_%20The%20Less%20You%20Need%20Them,%20The%20More%20They%20Need%20You.mp3", name: "The Less You Need Them" },
    { src: "/winamp/BITCH_I_DID-THE.RACE.mp3", name: "Bitch I Did The Race" },
    { src: "/winamp/DESTRUCTION%20%20%20(200%20BPM).mp3", name: "Destruction (200 BPM)" },
    { src: "/winamp/Heart%20Of%20Stone.mp3", name: "Heart Of Stone" },
    { src: "/winamp/O%CC%83%E2%80%A6%20%20%20%20%20O%CC%83%CB%84O%CC%83%E2%82%AC%20O%CC%83%E2%82%ACO%CC%83Z%CC%8C%20O%CC%83%E2%80%A6O%CC%83%CB%84%20O%CC%83_E%CC%80_%20E%CC%82%E2%80%A6E%CC%80_O%CC%83%E2%80%A1O%CC%82%C2%B5O%CC%83_%20%20O%CC%82%BEO%CC%83%E2%80%A1O%CC%83%CB%84%20%20%20%20%20O%CC%82%C2%B5%20%20E%CC%81%BF%20%20%20O%CC%83%E2%80%A1%20O%CC%82%B9loud.mp3", name: "Loud Track" },
    { src: "/winamp/a%CC%83%E2%82%AC_Haku%20Covera%CC%83%E2%82%AC%E2%80%98MONO%20NO%20AWARE%20%20a%CC%83_%E2%80%B9a%CC%83%E2%80%9A%E2%82%ACa%CC%83_%E2%80%B9a%CC%83%E2%80%9A%E2%82%82a%CC%83_%E2%80%97a%CC%83_%E2%80%B9a%CC%83%E2%80%9A%E2%82%82a%CC%83_%C2%ABa%CC%83_%C2%A9a%CC%83%E2%80%9A%E2%82%82a%CC%83_%E2%80%B9a%CC%83%E2%80%9A%E2%82%82i%CC%88%BC_.mp3", name: "Mono No Aware (Haku Cover)" },
    { src: "/winamp/dqdvTSDlaMKx.128.mp3", name: "Track 7" },
    { src: "/winamp/exorcism.mp3", name: "Exorcism" },
    { src: "/winamp/long%20day.mp3", name: "Long Day" },
    { src: "/winamp/recipie%20for%20a%20femcel%20(boxxy%20f4g%20V2).mp3", name: "Recipe for a Femcel (Boxxy F4g V2)" },
    { src: "/winamp/%E2%98%86%E3%80%9Clovestor_y%E3%80%9C%E2%98%86(bladee%20&%20ECCO2K%20remix).mp3", name: "Lovestory (Bladee & ECCO2K Remix)" },
  ];

  // Fetch mint status (for now, using a placeholder since backend isn't deployed)
  useEffect(() => {
    // Later, this will fetch from your backend (e.g., /api/get-odyssey)
    setMintStatus("coming_soon"); // Hardcoded for now
  }, []);

  // Detect user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  // Update audio source when currentTrackIndex changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrackIndex].src;
      if (isPlaying && hasInteracted) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false); // Reset play state if playback fails
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, isPlaying, hasInteracted]);

  // Toggle play/pause for the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  // Go to the next track
  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length; // Loop back to first track
    setCurrentTrackIndex(nextIndex);
    if (!hasInteracted) {
      setIsPlaying(false); // Don't auto-play until user interacts
    }
  };

  // Go to the previous track
  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length; // Loop to last track
    setCurrentTrackIndex(prevIndex);
    if (!hasInteracted) {
      setIsPlaying(false); // Don't auto-play until user interacts
    }
  };

  return (
    <Layout>
      {/* Header with Wallet Selector */}
      <Row align="middle" style={{ padding: "10px" }}>
        <Col span={12}>
          <h1 style={{ color: "black", margin: 0 }}>Milady Type A</h1>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <WalletSelector />
        </Col>
      </Row>

      {/* Preview GIF */}
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col>
          <img src="/preview.gif" alt="Preview GIF" className="preview-gif" />
          <p className="gif-subtitle">A Glimpse of the 2000s!</p>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
        <Col span={24}>
          <div className="xp-window">
            <div className="title-bar">Milady Type A</div>
            <div className="content">
              <h1>
                a collective vision of ideals behind the pursuit of our manifest
                network destiny, we want to roam in this open pasture and build
                upon this new land which we call Aptos.
              </h1>
              <p>4,444 supply 🌐🤍 1,444 free mints</p>
              <p>public mint 🌐🤍 11 APTOS</p>
              <p>1,000 discounted mints 🌐🤍 5 APTOS</p>
              <p>𝒲𝐻𝐼𝒯𝐸𝐿𝐼𝒮𝒯</p>
              <p>
                <a
                  href="https://miladymaker.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝑀𝒾𝓁𝒶𝒹𝓎 𝑀𝒶𝓀𝑒𝓇
                </a>
              </p>
              <p>
                <a
                  href="https://remilio.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝑅𝑒𝒹𝒶𝒸𝓂𝒾𝓁𝒾𝑜 𝐵𝒶𝒷𝒾𝑒𝓈
                </a>
              </p>
              <p>
                <a
                  href="https://radbro.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝑅𝒶𝒹𝒷𝓇𝑜
                </a>
              </p>
              <p>
                <a
                  href="https://radbro.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝑅𝒶𝒹𝒸𝒶𝓉
                </a>
              </p>
              <p>
                <a
                  href="https://www.scatter.art/kawamii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒦𝒶𝓌𝒶𝓂𝒾𝒾 𝒯𝑒𝑒𝓃𝓈
                </a>
              </p>
              <p>
                <a
                  href="https://www.tensor.trade/trade/midladys_fumogeddon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝑀𝒾𝒹𝓁𝒶𝒹𝓎
                </a>
              </p>
              <p>
                <a
                  href="https://www.scatter.art/collection/pixelady-maker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒫𝒾𝓍𝑒𝓁𝒶𝒹𝓎 𝑀𝒶𝓀𝑒𝓇
                </a>
              </p>
              <p>
                <a
                  href="https://magiceden.us/collections/base/0xee7d1b184be8185adc7052635329152a4d0cdefa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒦𝑒𝓂𝑜𝓃𝑜𝓀𝒶𝓀𝒾
                </a>
              </p>
              <p>
                <a
                  href="https://x1333.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝟣𝟥𝟥𝟥 𝒸𝑜
                </a>
              </p>
              <p>
                <a
                  href="https://magiceden.us/marketplace/uwu_banners"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒰𝓌𝒰 𝐵𝒶𝓃𝓃𝑒𝓇𝓈
                </a>
              </p>
              <p>
                <a
                  href="https://www.scatter.art/twilight-rooms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒯𝓌𝒾𝑔𝒽𝓁𝒾𝑔𝒽𝓉 𝑅𝑜𝑜𝓂𝓈
                </a>
              </p>
              <p>
                <a
                  href="https://opensea.io/collection/7w1l1gh7z0n3-vol-1-meowmaows"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒯𝓌𝒾𝑔𝒽𝓁𝒾𝑔𝒽𝓉 𝒵𝑜𝓃𝑒
                </a>
              </p>
              <p>
                <a
                  href="https://aptosfoundation.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitelist-link"
                >
                  𝒜𝓅𝓉𝑜𝓈 𝒲𝒽𝒶𝓁𝑒𝓈
                </a>
              </p>
              <div className="marquee-container">
  <div className={`marquee ${marqueePaused ? "paused" : ""}`}>
    <span>ｂｒｉｎｇｉｎｇ ｍｉｌａｄｙ ｔｏ ｔｈｅ ａｐｔｏｓ ｎｅｔｗｏｒｋ ｔｈｉｓ ｓｐｒｉｎｇ 🌐🤍</span>
  </div>
  <button
    className="marquee-toggle"
    onClick={() => setMarqueePaused(!marqueePaused)}
    aria-label={
      marqueePaused
        ? "Play marquee animation"
        : "Pause marquee animation"
    }
  >
    {marqueePaused ? "▶️ Play" : "⏸️ Pause"}
  </button>
</div>
              <div className="winamp">
                <div className="winamp-header">Winamp Retro Player</div>
                <div className="winamp-display">
                  🎵 {playlist[currentTrackIndex].name}
                </div>
                <audio
                  ref={audioRef}
                  src={playlist[currentTrackIndex].src}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="winamp-controls">
                  <button
                    className="winamp-control"
                    onClick={prevTrack}
                    aria-label="Previous track"
                  >
                    ⏮️ Prev
                  </button>
                  <button
                    className="winamp-control"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  >
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                  </button>
                  <button
                    className="winamp-control"
                    onClick={nextTrack}
                    aria-label="Next track"
                  >
                    ⏭️ Next
                  </button>
                </div>
              </div>
              <Button className="connect-btn">Connect Wallet</Button>
              <Button
                className="mint-btn"
                disabled={mintStatus !== "active"} // Disable until minting is active
              >
                Mint Now
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Row justify="center" style={{ marginTop: "2rem", marginBottom: "20px" }}>
        <Col>
          <p className="footer-text">© 2025 Milady Type A</p>
        </Col>
      </Row>
    </Layout>
  );
}

export default App;