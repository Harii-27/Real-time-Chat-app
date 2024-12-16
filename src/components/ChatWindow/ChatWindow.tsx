import React, { useState, useRef, useEffect } from 'react';
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store';
import { Message, User } from '../../types';
import { FaPlus, FaRegFaceSmile } from "react-icons/fa6";
import { formatMessageTime } from '../../utils/DateUtils';
import { FaPhone, FaVideo, FaFileAlt } from 'react-icons/fa';
import './ChatWindow.css';

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]); // Local state for messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]); // Scroll when localMessages change

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUser && selectedUser) {
      const newMessage: Message = {
        id: `${currentUser.id}-${Date.now()}`, // Generate a unique ID for the message
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: message,
        timestamp: Date.now(),
      };

      // Add the new message to localMessages
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Clear the input field
    }
  };

  if (!selectedUser) {
    return (
      <div className="chatWindow">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  // Filter the local messages that are between the current user and the selected user
  const chatMessages = localMessages.filter(
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
