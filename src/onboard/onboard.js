import React from "react";
import { Redirect } from "react-router-dom";
import uuid from "uuid/v4";
import { ColorContext } from "../context/colorcontext";

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
    inputText: "",
    gameId: "",
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  send = () => {
    const newGameRoomId = uuid();
    this.setState({
      gameId: newGameRoomId,
    });
    socket.emit("createNewGame", newGameRoomId);
  };

  typingUserName = () => {
    const typedText = this.textArea.current.value;
    this.setState({
      inputText: typedText,
    });
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
                <input
                  ref={this.textArea}
                  className="input-field"
                  onInput={this.typingUserName}
                  placeholder="Enter wallet address"
                />
                <button
                  className="button"
                  disabled={!(this.state.inputText.length > 0)}
                  onClick={() => {
                    this.props.didRedirect();
                    this.props.setUserName(this.state.inputText);
                    this.setState({
                      didGetUserName: true,
                    });
                    this.send();
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
