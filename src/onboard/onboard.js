import React from "react";
import { Redirect } from "react-router-dom";
import uuid from "uuid/v4";
import { ColorContext } from "../context/colorcontext";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from "../constants/consts";
import abi from "../constants/abi.json";

const socket = require("../connection/socket").socket;

const styles = `
  .game-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .glass-card {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .blur-circle {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: -1;
    opacity: 0.7;
    mix-blend-mode: multiply;
    animation: float 8s infinite ease-in-out;
  }

  .blur-circle-1 {
    background: #c084fc;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  .blur-circle-2 {
    background: #f472b6;
    top: -100px;
    right: -100px;
    animation-delay: 2s;
  }

  .blur-circle-3 {
    background: #93c5fd;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .title {
    color: white;
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .input-field {
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 16px;
    color: white;
    margin-bottom: 24px;
    transition: all 0.3s ease;
  }

  .input-field::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .input-field:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  .button {
    width: 100%;
    padding: 12px 24px;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

class CreateNewGame extends React.Component {
  state = {
    didGetUserName: false,
    walletAddress: '',
    isConnecting: false,
    gameId: '',
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  send = async () => {
    if (!this.state.walletAddress) {
        alert("Please connect your wallet first.");
        return;
    }
      
    const newGameRoomId = uuid();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    
    const entryFee = ethers.utils.parseEther("0.0001");

    // Call the smart contract function with payable amount
    const tx = await contract.createGame(newGameRoomId, { value: entryFee });
    await tx.wait();

    this.setState({
        gameId: newGameRoomId,
    });

    socket.emit("createNewGame", newGameRoomId);
  };

  connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
  
    this.setState({ isConnecting: true });
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // v5 syntax
  
      // Request access to the user's accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      const signer = provider.getSigner(); // No need for `await`
      const address = await signer.getAddress();
  
      this.setState({
        walletAddress: address,
        isConnecting: false,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      this.setState({ isConnecting: false });
    }
  };

  render() {
    return (
      <>
        <style>{styles}</style>
        <div className="game-container">
          <div className="glass-card">
            <div className="blur-circle blur-circle-1"></div>
            <div className="blur-circle blur-circle-2"></div>
            <div className="blur-circle blur-circle-3"></div>

            {this.state.didGetUserName ? (
              <Redirect to={"/game/" + this.state.gameId}>
                <button className="button">Start Game</button>
              </Redirect>
            ) : (
              <>
                <h1 className="title">Enter the Arena</h1>
                <button
                  className="button"
                  disabled={this.state.isConnecting}
                  onClick={this.connectWallet}
                >
                  {this.state.isConnecting ? 'Connecting...' : 
                   this.state.walletAddress ? `Connected: ${this.state.walletAddress.slice(0, 6)}...` : 
                   'Connect Wallet'}
                </button>
                <button
                  className="button"
                  disabled={!(this.state.walletAddress)}
                  onClick={async () => {
                    this.props.setUserName(this.state.walletAddress);
                    await this.send();
                    this.setState({
                      didGetUserName: true,
                    });
                    this.props.didRedirect();
                  }}
                >
                  Create Game
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

const Onboard = (props) => {
  const color = React.useContext(ColorContext);
  return (
    <CreateNewGame
      didRedirect={color.playerDidRedirect}
      setUserName={props.setUserName}
    />
  );
};

export default Onboard;
