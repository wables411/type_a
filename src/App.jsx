import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { database } from './firebase';
import { ref, onValue, push } from 'firebase/database';
import Mp3Player from './Mp3Player';
import ErrorBoundary from './ErrorBoundary';
import Player from '@vimeo/player';
import './App.css';

// Chat component (unchanged)
const Chat = () => {
  const [messages, setMessages] = useState(['welcome to milady type_a chat room! say hi to get started']);
  const [chatMessage, setChatMessage] = useState('');
  const [username, setUsername] = useState('');
  const chatLogRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.values(data).map((msg) => `${msg.username}: ${msg.text}`)
        : ['welcome to milady type_a chat room! say hi to get started.'];
      setMessages(loadedMessages);
    });
  }, []);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!username) {
      alert('please enter a username');
      return;
    }

    const message = chatMessage.trim();
    if (message === '') return;

    const messagesRef = ref(database, 'messages');
    push(messagesRef, {
      username: username,
      text: message,
      timestamp: Date.now(),
    });

    setChatMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="box chat">
      <p><strong>Chat:</strong> welcome to milady type_a chat room </p>
      <div className="chat-log" ref={chatLogRef}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className="username-input">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username..."
          maxLength="20"
        />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          maxLength="100"
        />
        <button onClick={sendMessage} className="chat-button">Send</button>
      </div>
    </div>
  );
};

const App = () => {
  const { account, connected, disconnect, wallets, connect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(null);
  const [playerError, setPlayerError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleConnect = async () => {
    if (!wallets || wallets.length === 0) {
      alert('No wallets available. Please install Petra Wallet.');
      return;
    }

    setIsConnecting(true);
    try {
      await connect('Petra');
      console.log('Connected to wallet:', account);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
      let errorMessage = 'Failed to connect wallet. Please ensure Petra Wallet is installed and try again.';
      if (error.message?.includes('Wallet not found')) {
        errorMessage = 'Petra Wallet not found. Please install the Petra Wallet extension.';
      } else if (error.message?.includes('Connection failed')) {
        errorMessage = 'Failed to connect to Petra Wallet. Please try again.';
      }
      alert(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log('Disconnected from wallet');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      alert('Failed to disconnect wallet.');
    }
  };

  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  useEffect(() => {
    const handleMouseMove = throttle((e) => {
      const bee = document.createElement('div');
      bee.classList.add('bee-trail');
      bee.textContent = '🐝';
      bee.style.left = (e.pageX + 20) + 'px';
      bee.style.top = (e.pageY + 20) + 'px';

      if (lastMouseX !== null) {
        const direction = e.pageX > lastMouseX ? 1 : -1;
        bee.style.transform = `translate(-50%, -50%) scaleX(${direction})`;
      }
      setLastMouseX(e.pageX);

      document.body.appendChild(bee);
      setTimeout(() => {
        bee.remove();
      }, 1000);
    }, 100);

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastMouseX]);

  useEffect(() => {
    if (connected) {
      console.log('Wallet connected:', connected);
      console.log('Wallet account object:', account);
    }
  }, [connected, account]);

  // Initialize Vimeo Player
  useEffect(() => {
    if (iframeRef.current && !playerRef.current) {
      console.log('Initializing Vimeo player...');
      try {
        playerRef.current = new Player(iframeRef.current, {
          controls: true, // Enable default Vimeo controls
          autoplay: false,
        });

        console.log('Vimeo player instance created:', playerRef.current);

        playerRef.current.on('error', (error) => {
          console.error('Vimeo player error:', error);
          setPlayerError('Video player encountered an error: ' + error.message);
        });

        playerRef.current.setVolume(1.0).catch((error) => {
          console.error('Error setting Vimeo player volume:', error);
        });

        playerRef.current.setMuted(false).catch((error) => {
          console.error('Error unmuting Vimeo player:', error);
        });

        setPlayerError(null);
      } catch (error) {
        console.error('Failed to initialize Vimeo player:', error);
        setPlayerError('Failed to load video player.');
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.unload().then(() => {
          console.log('Vimeo player unloaded');
          playerRef.current = null;
        }).catch((error) => {
          console.error('Error unloading Vimeo player:', error);
        });
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [retryKey]);

  const handleRetry = () => {
    console.log('Retrying player initialization...');
    setPlayerError(null);
    setRetryKey((prev) => prev + 1);
  };

  const walletAddress = account?.address?.toString() || 'Unknown Address';

  return (
    <div className="container">
      <div className="image-wrapper">
        <img src="/assets/miladytype_a_logo.png" alt="Milady Type A Logo" className="title-logo" />
        <img src="/assets/typeaheader.gif" alt="Header GIF" className="header-gif" />
      </div>
      <div className="box description">
        <p>
          𝙼𝚒𝚕𝚊𝚍𝚢 : 𝚃𝚢𝚙𝚎 𝙰 𝚒𝚜 𝚊 𝚌𝚘𝚕𝚕𝚎𝚌𝚝𝚒𝚘𝚗 𝚘𝚏 𝟺,𝟺𝟺𝟺 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚟𝚎 𝚙𝚏𝚙𝙽𝙵𝚃&apos;𝚜 𝚒𝚗 𝚊 𝚗𝚎𝚘𝚌𝚑𝚒𝚋𝚒 𝚊𝚎𝚜𝚝𝚑𝚎𝚝𝚒𝚌 𝚒𝚗𝚜𝚙𝚒𝚛𝚎𝚍 𝚋𝚢 𝙼𝚒𝚕𝚊𝚍𝚢 𝙼𝚊𝚔𝚎𝚛 𝙽𝙵𝚃, 𝚁𝚎𝚖𝚒𝚕𝚒𝚊 𝙲𝚘𝚛𝚙𝚘𝚛𝚊𝚝𝚒𝚘𝚗, 𝚊𝚜 𝚠𝚎𝚕𝚕 𝚊𝚜 𝚒𝚝𝚜 𝚖𝚊𝚗𝚢 𝚍𝚎𝚛𝚒𝚟𝚊𝚝𝚒𝚟𝚎𝚜. 𝚃𝚢𝚙𝚎 𝙰 𝚛𝚎𝚙𝚛𝚎𝚜𝚎𝚗𝚝𝚜 𝚎𝚕𝚎𝚖𝚎𝚗𝚝𝚜 𝚘𝚏 𝚑𝚒𝚐𝚑-𝚙𝚎𝚛𝚏𝚘𝚛𝚖𝚊𝚗𝚌𝚎 𝚊𝚝𝚝𝚛𝚒𝚋𝚞𝚝𝚎𝚍 𝚋𝚢 𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚞𝚗𝚒𝚝𝚢 𝚊𝚗𝚍 𝚌𝚞𝚕𝚝𝚞𝚛𝚊𝚕 𝚒𝚌𝚘𝚗𝚜 𝚘𝚗 𝚝𝚑𝚎 𝙰𝚙𝚝𝚘𝚜 𝚗𝚎𝚝𝚠𝚘𝚛𝚔.
        </p>
      </div>
      <div className="box minting">
        <p>𝙱𝚛𝚒𝚍𝚐𝚒𝚗𝚐 𝙼𝚒𝚕𝚊𝚍𝚢 𝚝𝚘 𝙰𝚙𝚝𝚘𝚜 S𝚙𝚛𝚒𝚗𝚐 2025 🌐🤍🌷</p>
        <div className="video-wrapper">
          <div style={{ position: 'relative', width: '375px', height: '211px' }}>
            <iframe
              key={retryKey}
              ref={iframeRef}
              src="https://player.vimeo.com/video/1070103341?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&transparent=0"
              title="type_a"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></iframe>
          </div>
          {playerError && (
            <div className="error-container">
              <p className="error-text">{playerError}</p>
              <button onClick={handleRetry} className="retry-button">
                Retry
              </button>
            </div>
          )}
        </div>
        <p>𝟺,𝟺𝟺𝟺 𝚜𝚞𝚙𝚙𝚕𝚢 🌐🤍 𝟷,𝟺𝟺𝟺 𝚏𝚛𝚎𝚎 𝚖𝚒𝚗𝚝𝚜</p>
        <p>𝚙𝚞𝚋𝚕𝚒𝚌 �𝚖𝚒𝚗𝚝 🌐🤍 𝟷𝟷 𝙰𝙿𝚃𝙾𝚂</p>
        <p>𝟷,𝟶𝟶𝟶 𝚍𝚒𝚜𝚌𝚘𝚞𝚗𝚝𝚎𝚍 𝚖𝚒𝚗𝚝𝚜 🌐🤍 𝟻 𝙰𝙿𝚃𝙾𝚂</p>
        <img src="assets/whitelist.png" alt="whitelist" className="whitelist-meme" />
        <p>𝙒𝙃𝙄𝙏𝙀𝙇𝙄𝙎𝙏</p>
        <p><a href="https://miladymaker.net/" target="_blank" rel="noreferrer" className="whitelist-link">𝑀𝒾𝓁𝒶𝒹𝓎 𝑀𝒶𝓀𝑒𝓇</a></p>
        <p><a href="https://remilio.org/" target="_blank" rel="noreferrer" className="whitelist-link">𝑅𝑒𝒹𝒶𝒸𝓂𝒾𝓁𝒾𝓸 𝐵𝒶𝒷𝒾𝑒𝓈</a></p>
        <p><a href="https://radbro.xyz/" target="_blank" rel="noreferrer" className="whitelist-link">𝑅𝒶𝒹𝒷𝓇𝓸</a></p>
        <p><a href="https://radbro.xyz/" target="_blank" rel="noreferrer" className="whitelist-link">𝑅𝒶𝒹𝒸𝒶𝓉</a></p>
        <p><a href="https://www.scatter.art/kawamii" target="_blank" rel="noreferrer" className="whitelist-link">𝒦𝒶𝓌𝒶𝓂𝒾𝒾 𝒯𝑒𝑒𝓃𝓈</a></p>
        <p><a href="https://www.tensor.trade/trade/midladys_fumogeddon" target="_blank" rel="noreferrer" className="whitelist-link">𝑀𝒾𝒹𝓁𝒶𝒹𝓎</a></p>
        <p><a href="https://www.scatter.art/collection/pixelady-maker" target="_blank" rel="noreferrer" className="whitelist-link">𝒫𝒾𝓍𝑒𝓁𝒶𝒹𝓎 𝑀𝒶𝓀𝑒𝓇</a></p>
        <p><a href="https://magiceden.us/collections/base/0xee7d1b184be8185adc7052635329152a4d0cdefa" target="_blank" rel="noreferrer" className="whitelist-link">𝒦𝑒𝓂𝓸𝓃𝓸𝓀𝒶𝓀𝒾</a></p>
        <p><a href="https://x1333.net/" target="_blank" rel="noreferrer" className="whitelist-link">𝟣𝟥𝟥𝟥 𝒸𝓸</a></p>
        <p><a href="https://magiceden.us/marketplace/uwu_banners" target="_blank" rel="noreferrer" className="whitelist-link">𝒰𝓌𝒰 𝐵𝒶𝓃𝓃𝑒𝓇𝓈</a></p>
        <p><a href="https://www.scatter.art/twilight-rooms" target="_blank" rel="noreferrer" className="whitelist-link">𝒯𝓌𝒾𝑔𝒽𝓁𝒾𝑔𝒽𝓉 𝑅𝓸𝓸𝓂𝓈</a></p>
        <p><a href="https://opensea.io/collection/7w1l1gh7z0n3-vol-1-meowmaows" target="_blank" rel="noreferrer" className="whitelist-link">𝒯𝓌𝒾𝑔𝒽𝓁𝒾𝑔𝒽𝓉 𝒵𝓸𝓃𝑒</a></p>
        <p><a href="https://aptosfoundation.org/" target="_blank" rel="noreferrer" className="whitelist-link">𝒜𝓅𝓉𝓸𝓈 𝒲𝒽𝒶𝓁𝑒𝓈</a></p>
        <p>𝙈𝙄𝙉𝙏 𝙋𝙍𝙊𝘾𝙀𝙀𝘿𝙎</p>
        <p>𝟸𝟶% 𝚘𝚏 𝚖𝚒𝚗𝚝 𝚙𝚛𝚘𝚌𝚎𝚎𝚍𝚜 𝚍𝚒𝚛𝚎𝚌𝚝𝚎𝚍 𝚝𝚘𝚠𝚊𝚛𝚍𝚜 𝚛𝚎𝚖𝚒𝚕𝚒𝚊 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚢</p>
        <p>𝟻% 𝚍𝚒𝚛𝚎𝚌𝚝𝚎𝚍 𝚝𝚘𝚠𝚊𝚛𝚍𝚜 𝚎𝚖𝚘𝚓𝚒𝚌𝚘𝚒𝚗 𝚊𝚜𝚜𝚎𝚝𝚜 𝚘𝚗 𝙰𝚙𝚝𝚘𝚜! 🌐🐝🧀</p>
        <p>𝟻% 𝚊𝚕𝚕𝚘𝚌𝚊𝚝𝚎𝚍 𝚏𝚘𝚛 𝚐𝚒𝚟𝚎𝚊𝚠𝚊𝚢𝚜/𝚌𝚘𝚗𝚝𝚎𝚜𝚝𝚜 𝚠𝚒𝚝𝚑𝚒𝚗 𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚞𝚗𝚒𝚝𝚢</p>
      </div>
      {/* Add the clickable button for bridgeaptos.gif */}
      <a href="https://stargate.finance/bridge" target="_blank" rel="noreferrer" className="gif-button">
        <img src="/assets/bridgeaptos.gif" alt="Bridge to Aptos" />
      </a>
      <div className="wallet-section">
        {connected ? (
          <>
            <p>
              Connected as:{' '}
              {walletAddress !== 'Unknown Address'
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : walletAddress}
            </p>
            <button onClick={handleDisconnect} className="chat-button">
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button onClick={handleConnect} className="chat-button" disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
      <ErrorBoundary>
        <Mp3Player />
      </ErrorBoundary>
      <Chat />
      <a href="https://www.youtube.com/watch?v=-mqXXqB7SBQ" target="_blank" rel="noreferrer" className="gif-button">
        <img src="/assets/miladytypeadrift.gif" alt="youtube button" />
      </a>
    </div>
  );
};

export default App;