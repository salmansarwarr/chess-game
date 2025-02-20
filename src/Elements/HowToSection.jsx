import { Wallet, Coins, GamepadIcon, Trophy } from 'lucide-react';
import React from 'react';
import "./HowtoSection.css"; // Import CSS file

const steps = [
    {
        title: "Connect MetaMask",
        description: "Link your MetaMask wallet to start playing. It's your gateway to decentralized chess.",
        icon: Wallet,
        color: "purple"
    },
    {
        title: "Get MOL Coins",
        description: "Power your games with Anryton's MOL coins. Stack them, use them, win more.",
        icon: Coins,
        color: "pink"
    },
    {
        title: "Start Playing",
        description: "Jump into matches, make your moves, and let the blockchain record your victory.",
        icon: GamepadIcon,
        color: "purple"
    }
];

export default function HowToSection() {
    return (
        <div className="howto-section">
            {/* Background Elements */}
            <div className="background-elements">
                <div className="purple-blur" />
                <div className="pink-blur" />
            </div>

            <div className="floating-icon trophy-top">
                <Trophy size={32} className="icon-purple" />
            </div>
            <div className="floating-icon trophy-bottom">
                <Trophy size={32} className="icon-pink" />
            </div>

            <div className="howto-container">
                <div className="howto-header">
                    <h2 className="howto-title">Get Started in Minutes</h2>
                    <p className="howto-description">
                        Join the future of chess where every move is secured by blockchain technology.
                        Here's how to begin your journey.
                    </p>
                </div>

                <div className="howto-steps">
                    {steps.map((step) => (
                        <div key={step.title} className="step-card">
                            <div className={`step-icon ${step.color === 'purple' ? 'bg-purple' : 'bg-pink'}`}>
                                <step.icon size={24} className="icon-white" />
                            </div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="howto-footer">
                    <button className="connect-wallet-btn">
                        Connect Wallet to Start
                    </button>
                </div>
            </div>
        </div>
    );
}
