import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What is Web3 Chess?",
    answer:
      "Web3 Chess is a decentralized platform where every move is recorded on the blockchain, ensuring transparency and security.",
  },
  {
    question: "How do I start playing?",
    answer:
      "Simply create an account, connect your Web3 wallet, and start competing against players worldwide.",
  },
  {
    question: "Is Web3 Chess free to play?",
    answer:
      "Yes, you can play for free, but there are also premium tournaments and NFTs available.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-card ${openIndex === index ? "open" : ""}`} onClick={() => toggleFAQ(index)}>
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-icon">{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
