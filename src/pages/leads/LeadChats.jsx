import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

// Individual message bubble
const ChatMessage = ({ message }) => (
  <div
    className={`flex ${
      message.fromClient ? "justify-start" : "justify-end"
    } mb-2`}
  >
    <div
      className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
        message.fromClient
          ? "bg-white text-gray-800 rounded-bl-none"
          : "bg-green-500 text-white rounded-br-none"
      }`}
    >
      {message.text}
      <div className="text-[10px] text-gray-300 mt-1 text-right">
        {message.time}
      </div>
    </div>
  </div>
);

const LeadChats = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Simulate fetching messages
  useEffect(() => {
    const dummyChats = [
      {
        text: "Hello, I'm interested in your service.",
        fromClient: true,
        time: "10:01 AM",
      },
      {
        text: "Great! I can help you with that.",
        fromClient: false,
        time: "10:02 AM",
      },
    ];
    setMessages(dummyChats);
  }, []);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const msgObj = { text: newMsg, fromClient: false, time };
    setMessages((prev) => [...prev, msgObj]);
    setNewMsg("");
  };

  return (
    <div className="bg-[#e5ddd5] rounded-lg shadow border flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-green-600 text-white font-medium px-4 py-2">Chats</div>

      {/* Message list */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center p-2 border-t bg-white">
        <input
          className="flex-1 p-2 border rounded-full outline-none text-sm"
          placeholder="Type a message"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default LeadChats;
