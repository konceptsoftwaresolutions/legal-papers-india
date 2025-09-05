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

  return (
    <div className={`flex ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-[18px] text-sm break-words shadow ${
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
    setNewMsg(""); // clear input immediately for UX

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
      <div className="flex-1 px-4 py-2 overflow-y-auto flex flex-col">
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
        <div />
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
