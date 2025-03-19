import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import "./Chatbot.css";

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([{ text: "Hi! How can I help you?", sender: "bot" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);
    const messagesEndRef = useRef(null); // Auto-scroll reference

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:7254/api/Function1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const botMessage = { text: data.reply, sender: "bot" };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to AI.", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-window" ref={chatRef}>
            {/* Header */}
            <div className="chat-header">
                <span>Chat with AI</span>
                <button className="close-chat" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <p key={index} className={`chat-message ${msg.sender}`}>{msg.text}</p>
                ))}
                {loading && <p className="chat-message bot">Typing...</p>}
                <div ref={messagesEndRef} /> {/* Invisible div for auto-scroll */}
            </div>

            {/* Chat Footer */}
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Enter your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                />
                <button className="send-button" onClick={sendMessage} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
