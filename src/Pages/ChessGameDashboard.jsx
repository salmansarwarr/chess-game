import React, { useState } from 'react';

const ChessGameDashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const sampleGames = [
        {
            id: 1,
            title: "Cyber Conquest",
            players: 4,
            creator: "NightRider",
            status: "In Progress"
        },
        {
            id: 2,
            title: "Neon Warfare",
            players: 2,
            creator: "DigitalPhantom",
            status: "Open"
        },
        {
            id: 3,
            title: "Quantum Battle",
            players: 6,
            creator: "TechMage",
            status: "In Progress"
        }
    ];

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(to bottom right, #6b21a8, #000000, #be185d)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
              paddingTop: '10%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <button
                onClick={() => setShowModal(true)}
                style={{
                    background: 'linear-gradient(45deg, #6b21a8, #3b0764)',
                    color: 'white',
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(107, 33, 168, 0.3)'
                }}
            >
                Create New Game
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'rgba(41, 4, 71, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '2rem',
                        borderRadius: '15px',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}>
                        <h2 style={{
                            color: 'white',
                            marginBottom: '1.5rem',
                            fontSize: '1.5rem'
                        }}>Create New Game</h2>

                        <input
                            type="text"
                            placeholder="Game Title"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                marginBottom: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />

                        <input
                            type="number"
                            placeholder="Number of Players"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                marginBottom: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #6b21a8, #3b0764)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                marginTop: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {sampleGames.map(game => (
                    <div key={game.id} style={{
                        background: 'rgba(41, 4, 71, 0.6)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        ':hover': {
                            transform: 'translateY(-5px)'
                        }
                    }}>
                        <h3 style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            marginBottom: '0.5rem'
                        }}>{game.title}</h3>

                        <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem'
                        }}>
                            <p>Players: {game.players}</p>
                            <p>Created by: {game.creator}</p>
                            <p>Status: {game.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChessGameDashboard;