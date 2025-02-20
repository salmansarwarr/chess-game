import React from "react";
import "./Hero.css"; // Import CSS file

export default function Hero() {
  return (
    <div className="hero-container">
      {/* Gradient Orbs */}
      <div className="hero-orb hero-orb-purple"></div>
      <div className="hero-orb hero-orb-pink"></div>

      {/* Glass Container */}
      <div className="hero-content">

        <div className="hero-glass">

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                  Web3 Chess Revolution
                </div>
                <h1 className="hero-title">
                  Decentralized
                  <br />
                  Chess Gaming
                </h1>
                <p className="hero-text">
                  Every move is secured on the blockchain. Play, compete, and own your gaming history in the most transparent chess platform ever created.
                </p>
              </div>

              <div>
                <div className="flex gap-4">
                  <button className="hero-btn hero-btn-primary">Play Now</button>
                  <button className="hero-btn hero-btn-secondary">Explore Games</button>
                </div>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="hero-stat-number">10k+</div>
                  <div>Games Played</div>
                </div>
                <div>
                  <div className="hero-stat-number">5k+</div>
                  <div>Players</div>
                </div>
                <div>
                  <div className="hero-stat-number">100k+</div>
                  <div>Moves Recorded</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="hero-image-container">
              {/* <img
                className="hero-image"
                src="https://i.pinimg.com/736x/a1/89/46/a18946aaa0391c46c29b4a6a49fa532f.jpg"
                alt="Chess"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
