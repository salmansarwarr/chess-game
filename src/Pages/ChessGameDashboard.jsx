import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants/consts";
import abi from "../constants/abi.json";
import { useHistory } from "react-router-dom";

const ChessGameDashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [availableGames, setAvailableGames] = useState([]);
    const [walletConnected, setWalletConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const history = useHistory();

    // 🔹 Function to check if wallet is connected
    const checkWalletConnection = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setWalletConnected(true);
                    setAccount(accounts[0]);
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    };

    // 🔹 Function to connect wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setWalletConnected(true);
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    // 🔹 Function to fetch available games
    const getAvailableGames = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const games = await contract.getAvailableGames();
        setAvailableGames(games);
    };

    // 🔹 Function to join a game
    const joinGame = async (gameId, roomId) => {
        if (!walletConnected) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const tx = await contract.joinGame(gameId, {
            value: ethers.utils.parseEther("0.0001"),
        });
        await tx.wait();

        history.push(`/game/${roomId}`);
    };

    useEffect(() => {
        checkWalletConnection();
        getAvailableGames();
    }, []);

    return (
        <div
            style={{
                marginTop: '500px',
                width: "100vw",
                height: "100vh",
                // background:
                //     "linear-gradient(to bottom right, #6b21a8, #000000, #be185d)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                paddingTop: "10%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* 🔹 Display "Connect Wallet" button if not connected */}
            {!walletConnected && (
                <button
                    onClick={connectWallet}
                    style={{
                        background: "linear-gradient(45deg, #6b21a8, #3b0764)",
                        color: "white",
                        padding: "1rem 2rem",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        boxShadow: "0 4px 15px rgba(107, 33, 168, 0.3)",
                    }}
                >
                    Connect Wallet
                </button>
            )}

            {/* 🔹 Display games only if the wallet is connected */}
            {walletConnected && (
                <div
                    style={{
                        marginTop: "2rem",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {[...availableGames].reverse().map((game, index) => {
                        const originalIndex = availableGames.length - 1 - index; // Get actual index in the original array

                        return (
                            <div
                                key={game.roomId}
                                style={{
                                    background: "rgba(41, 4, 71, 0.6)",
                                    borderRadius: "15px",
                                    padding: "1.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    transition: "transform 0.2s",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform =
                                        "translateY(-5px)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform =
                                        "translateY(0px)")
                                }
                            >
                                <div
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "0.9rem",
                                        textAlign: "center",
                                    }}
                                >
                                    <p>
                                        <strong>Room ID:</strong> {game.roomId}
                                    </p>
                                    <p>
                                        <strong>Player 1:</strong> {game.player1}
                                    </p>
                                    <p>
                                        <strong>Player 2:</strong>
                                        {game.player2 ===
                                        "0x0000000000000000000000000000000000000000"
                                            ? " Waiting for opponent..."
                                            : ` ${game.player2}`}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {game.isActive
                                            ? "Game in Progress"
                                            : "Completed"}
                                    </p>
                                    <p>
                                        <strong>Start Time:</strong>{" "}
                                        {new Date(
                                            BigNumber.from(
                                                game.startTime
                                            ).toNumber() * 1000
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                {/* 🔹 Show "Join Game" button only if there's an empty slot */}
                                {game.player2 ===
                                    "0x0000000000000000000000000000000000000000" && (
                                    <button
                                        style={{
                                            marginTop: "1rem",
                                            padding: "0.5rem 1rem",
                                            background: "#7c3aed",
                                            borderRadius: "8px",
                                            color: "white",
                                            fontSize: "1rem",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            border: "none",
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "#5b21b6")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "#7c3aed")
                                        }
                                        onClick={() => joinGame(originalIndex, game.roomId)}
                                    >
                                        Join Game
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChessGameDashboard;
