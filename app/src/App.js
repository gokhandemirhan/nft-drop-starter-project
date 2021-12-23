import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import CandyMachine from "./CandyMachine";

// Constants
const TWITTER_HANDLE = "_gokhandemirhan";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const isWalletConnected = async () => {
    try {
      //  Check if solana is binded to window
      const { solana } = window;
      if (solana) {
        // Check wallet
        if (solana.isPhantom) {
          console.log("Phantom wallet found");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Public key: ", response.publicKey.toString());

          // Set wallet address
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        console.log("Solana object not found");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Connect wallet logic
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Have a button to connect wallet
  const renderNotConnected = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect your wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };

    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Render if only not wallet connected */}
          {!walletAddress && renderNotConnected()}
        </div>

        {walletAddress && <CandyMachine walletAddress={window.solana} />}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
