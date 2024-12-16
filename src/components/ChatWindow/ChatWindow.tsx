import React, { useState, useEffect, useRef } from 'react';
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store';
import { Message, User } from '../../types';
import { FaPlus, FaRegFaceSmile } from "react-icons/fa6";
import { formatMessageTime } from '../../utils/DateUtils';
import { FaPhone, FaVideo, FaFileAlt } from 'react-icons/fa';
import './ChatWindow.css';

const ChatWindow = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);

  const scrollToEnd = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && currentUser && selectedUser) {
      const newMsg: Message = {
        id: `${currentUser.id}-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: inputMessage,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, newMsg]);
      setInputMessage('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="chatWindow">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const filteredMessages = messages.filter(
    msg => (msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
      (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id)
  );

  return (
    <div className="chatWindow">
      <div className="chatHeader">
        <div className="userInfo">
          <img src={selectedUser.avatar} alt={selectedUser.name} className="userAvatar" />
          <div>
            <p className="userName">{selectedUser.name}</p>
            <p className="userStatus">{selectedUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="chatHeaderIcons">
          <FaVideo className="chatIcon" title="Video Call" />
          <FaPhone className="chatIcon" title="Voice Call" />
          <FaFileAlt className="chatIcon" title="Share" />
        </div>
      </div>

      <div className="chatMessages">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className={`chatMessage ${msg.senderId === currentUser?.id ? 'chatMessageOutgoing' : 'chatMessageIncoming'}`}>
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
        <div ref={messageEndRef} />
      </div>

      <div className="chatInput">
        <form onSubmit={handleSendMessage} className="messageForm">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
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
};

export default ChatWindow;
