import React, { useEffect, useState, useRef, memo } from "react";
import { FiSend, FiRefreshCcw } from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatsByPhone,
  sendMessageToChat,
} from "../../redux/features/leads";
import { toast } from "react-toastify";

// Message bubble
const ChatMessage = ({ message }) => {
  const isFromMe = message.fromMe;
  const time = new Date(message.timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ✅ Channel name display with different colors for each channel
  const getChannelInfo = (channelId) => {
    if (!channelId) return { name: "", bgColor: "", textColor: "" };

    // Define beautiful color combinations for different channels
    const colorPalette = [
      { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
      {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
      {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
      },
      { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200" },
      {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      },
      {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-200",
      },
      { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
      { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-200" },
      {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      },
      { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    ];

    // Generate consistent color index for each channel
    let hash = 0;
    for (let i = 0; i < channelId.length; i++) {
      const char = channelId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const colorIndex = Math.abs(hash) % colorPalette.length;

    // Channel name formatting
    let displayName = "";
    if (channelId === "dipesh-personal") displayName = "Dipesh Personal";
    else if (channelId === "Sarthak") displayName = "Sarthak";
    else {
      displayName = channelId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return {
      name: displayName,
      ...colorPalette[colorIndex],
    };
  };

  const channelInfo = getChannelInfo(message.channelId);

  return (
    <div className={`flex ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
      <div className="flex flex-col max-w-[70%]">
        {/* ✅ Beautiful Channel name badge with unique colors */}
        {message.channelId && (
          <div className={`mb-1 ${isFromMe ? "self-end" : "self-start"}`}>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${channelInfo.bg} ${channelInfo.text} ${channelInfo.border} shadow-sm`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
              {channelInfo.name}
            </span>
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-[18px] text-sm break-words shadow ${
            isFromMe
              ? "bg-green-500 text-white rounded-tr-[2px] rounded-bl-[18px] rounded-tl-[18px] rounded-br-[18px]"
              : "bg-white text-gray-800 rounded-tl-[2px] rounded-br-[18px] rounded-tr-[18px] rounded-bl-[18px]"
          }`}
        >
          {message.body || ""}
          <div className="flex justify-end items-center text-[14px] text-gray-400 mt-1 gap-1">
            <span>{time}</span>
            {isFromMe && <BsCheck2All className="text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

// LeadChats component
const LeadChats = ({ phoneNumber }) => {
  const dispatch = useDispatch();

  const messagesFromRedux = useSelector(
    (state) => state.leads.chatMessages.messages || []
  );
  const chatLoading = useSelector((state) => state.leads.chatLoader);

  const [newMsg, setNewMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const phoneNumberRef = useRef(phoneNumber);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesFromRedux]);

  const refreshChats = async () => {
    if (!phoneNumberRef.current) return;
    setRefreshing(true);
    await dispatch(
      fetchChatsByPhone(phoneNumberRef.current, (success) => {
        if (!success) toast.error("Failed to refresh chats");
      })
    );
    setRefreshing(false);
  };

  useEffect(() => {
    refreshChats();
  }, []);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const messageToSend = newMsg.trim();
    setNewMsg("");

    await dispatch(
      sendMessageToChat(
        phoneNumberRef.current,
        messageToSend,
        async (success) => {
          if (success) {
            await dispatch(
              fetchChatsByPhone(phoneNumberRef.current, (fetchSuccess) => {
                if (!fetchSuccess) toast.error("Failed to refresh chats");
              })
            );
          } else {
            toast.error("Failed to send message");
          }
        }
      )
    );
  };

  return (
    <div className="bg-[#e5ddd5] rounded-lg shadow border flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-600 text-white font-medium px-4 py-2 rounded-t-lg">
        <span>Chats</span>
        <button
          onClick={refreshChats}
          type="button"
          className={`p-1 rounded hover:bg-green-700 transition transform ${
            refreshing ? "animate-spin" : ""
          }`}
          title="Refresh"
        >
          <FiRefreshCcw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 px-4 py-2 overflow-y-auto flex flex-col"
      >
        {chatLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : messagesFromRedux.length === 0 ? (
          <div className="text-gray-500 text-sm">No messages found</div>
        ) : (
          messagesFromRedux
            .filter((msg) => msg.body && msg.body.trim() !== "")
            .map((msg) => (
              <ChatMessage key={msg.id || Math.random()} message={msg} />
            ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t bg-white rounded-b-lg">
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
          type="button"
          onClick={handleSend}
          className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default memo(LeadChats);
