import React, { useState, useRef, useEffect } from 'react';
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { Message } from '../../types';
import { socketService } from '../../services/socket';
import { FaPlus, FaRegFaceSmile } from "react-icons/fa6";
import { formatMessageTime } from '../../utils/DateUtils';
import { FaPhone, FaVideo, FaFileAlt } from 'react-icons/fa';
import './ChatWindow.css';

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUser && selectedUser) {
      socketService.sendMessage({
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: message,
      });
      setMessage('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="chatWindow">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const chatMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
      (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id)
  );

  return (
    <div className="chatWindow">
      {/* Header */}
      <div className="chatHeader">
        <div className="userInfo">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="userAvatar"
          />
          <div>
            <p className="userName">{selectedUser.name}</p>
            <p className="userStatus">{selectedUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        {/* Icons */}
        <div className="chatHeaderIcons">
          <FaVideo className="chatIcon" title="Video Call" />
          <FaPhone className="chatIcon" title="Voice Call" />
          <FaFileAlt className="chatIcon" title="Share" />
        </div>
      </div>

      {/* Messages */}
      <div className="chatMessages">
        {chatMessages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`chatMessage ${
              msg.senderId === currentUser?.id
                ? 'chatMessageOutgoing'
                : 'chatMessageIncoming'
            }`}
          >
            <div className="messageWrapper">
              <img
                src={msg.senderId === currentUser?.id ? currentUser.avatar : selectedUser.avatar}
                alt="User Avatar"
                className="messageAvatar"
              />
              <div className="messageContentWrapper">
                <p className="messageContent">{msg.content}</p>
                <span className="messageTime">{formatMessageTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatInput">
        <form onSubmit={handleSend} className="messageForm">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="messageInput"
          />
          <FaRegFaceSmile className="emojiIcon" />
          <FaPlus className="plusIcon" />
          <button type="submit" className="sendButton">
            <BsArrowRightSquareFill className="sendIcon" />
          </button>
        </form>
      </div>
    </div>
  );
}
