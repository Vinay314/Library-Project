import React from "react";
import { X } from "lucide-react"; // Close button icon
import "./Chatbot.css";

const Chatbot = ({ onClose }) => {
  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <span>Chat with Vinay Rupchandani</span>
        <button className="close-chat" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        <p>Hi How can I help you?</p>
        <button className="chat-option">Looking for my package</button>
        <button className="chat-option">Track my order </button>
        <button className="chat-option">How do I track my order (FAQ)?</button>
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        <input type="text" placeholder="Enter your message..." />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chatbot;