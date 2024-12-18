import React, { useState, useEffect, useRef } from 'react';
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../Store/main';
import { reorderUsers, selectActiveUser } from '../Store/Slice'; 
import { Message, User } from '../types';
import { FaPlus, FaRegFaceSmile } from "react-icons/fa6";
import { getTimeString } from '../time/time';
import { FaPhone, FaVideo, FaFileAlt } from 'react-icons/fa';
import './components.css';

const MessageBox = () => { 
  const [inputMessage, setInputMessage] = useState('');
  const [messages, replaceMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { selectedUser, currentUser, usersOrder, users } = useSelector(
    (state: AppState) => state.message
  );


  useEffect(() => {
    if (!selectedUser) {
      const defaultUser = users.find(user => user.name === "CodeScribo");
      if (defaultUser) {
        dispatch(selectActiveUser(defaultUser));
      }
    }
  }, [dispatch, selectedUser, users]);

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

      replaceMessages((prev) => [...prev, newMsg]);
      setInputMessage('');


      const newOrder = [selectedUser.id, ...usersOrder.filter((id) => id !== selectedUser.id)];

      dispatch(reorderUsers(newOrder));
    }
  };

  if (!selectedUser) {
    return null;
  }

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
      (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id)
  );

  return (
    <div className="messageBox"> 
      <div className="messageHeader">
        <div className="userInfo">
          <img src={selectedUser.avatar} alt={selectedUser.name} className="userAvatar" />
          <div>
            <p className="userName">{selectedUser.name}</p>
            <p className="userStatus">{selectedUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="messageHeaderIcons">
          <FaVideo className="messageIcon" title="Video Call" />
          <FaPhone className="messageIcon" title="Voice Call" />
          <FaFileAlt className="messageIcon" title="Share" />
        </div>
      </div>

      <div className="messages">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === currentUser?.id ? 'messageOutgoing' : 'messageIncoming'
              }`}
          >
            <div className="context">
              <img
                src={
                  msg.senderId === currentUser?.id
                    ? currentUser.avatar
                    : selectedUser.avatar
                }
                alt="User Avatar"
                className="messageAvatar"
              />
              <div className="messageContentWrapper">
                <p className="messageContent">{msg.content}</p>
                <span className="messageTime">{getTimeString(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="messageinput">
        <form onSubmit={handleSendMessage} className="messageForm">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
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

export default MessageBox; 
