import React, { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
    // { name: "Play", isButton: true },
    { name: "Home", href: "/home" },
    { name: "Create Game", href: "/createGame" },
 
    { name: "Start Game", href: "/" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const handlePlay = () => {
        alert("Please connect your wallet");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo">
                    DeChess
                </Link>

                <div className="navbar-menu-desktop">
                    {menuItems.map((item) => (
                        item.isButton ? (
                            <button key={item.name} onClick={handlePlay} className="play-button">
                                {item.name}
                            </button>
                        ) : (
                            <Link key={item.name} to={item.href} className="navbar-link">
                                {item.name}
                            </Link>
                        )
                    ))}
                    <w3m-button />
                </div>

                <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {isOpen && (
                <div className="mobile-menu">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.isButton ? (
                                <button onClick={handlePlay} className="play-button">
                                    {item.name}
                                </button>
                            ) : (
                                <Link to={item.href} className="navbar-link">
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}

/* CSS Styling Inspired by Tailwind */

const styles = `
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 50;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
}

.navbar-logo {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    text-decoration: none;
}

.navbar-menu-desktop {
    display: flex;
    gap: 20px;
}

.navbar-link, .play-button {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;
}

.navbar-link:hover, .play-button:hover {
    color: #a855f7;
}

.mobile-menu {
    display: none;
    background: rgba(0, 0, 0, 0.9);
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0;
    padding: 20px;
    text-align: center;
}

.mobile-menu.open {
    display: block;
}

.menu-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.play-button {
    background: linear-gradient(to right, #9333ea, #ec4899);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.3s;
}

.play-button:hover {
    opacity: 0.9;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
