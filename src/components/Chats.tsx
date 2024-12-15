import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";  // Ensure correct import
import { ChatContext } from "../context/ChatContext";

// Define types for the chat and user (you can customize based on your requirements)
interface UserType {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface ChatType {
  userInfo: UserType;
  lastMessage: { text: string };
  date: number;
}

interface ChatsProps {
  ws: WebSocket | null;
}

const Chats: React.FC<ChatsProps> = ({ ws }) => {
  const [chats, setChats] = useState<ChatType[]>([]);
  
  // Safely access currentUser from AuthContext
  const { currentUser } = useContext(AuthContext) || { currentUser: null }; // Default fallback for context
  
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (ws && currentUser?.uid) {
      const getChats = () => {
        const getChatsMessage = JSON.stringify({
          type: "getChats",
          userId: currentUser.uid,
        });

        ws.send(getChatsMessage); // Request chats from the WebSocket server

        ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.type === "chats") {
            setChats(response.chats); // Set chats when received from server
          }
        };
      };

      getChats();
    }
  }, [ws, currentUser]);

  const handleSelect = (user: UserType) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  // Render loading or error message if currentUser is not available
  if (!currentUser) {
    return <div>Please log in to view your chats.</div>;
  }

  return (
    <div className="chats">
      {chats
        .sort((a, b) => b.date - a.date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat.userInfo.uid}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img src={chat.userInfo.photoURL} alt={chat.userInfo.displayName} />
            <div className="userChatInfo">
              <span>{chat.userInfo.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
