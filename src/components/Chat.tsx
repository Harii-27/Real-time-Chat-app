import { useContext, useState, useEffect } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import React from "react";

// Define the type for the props (with ws as WebSocket or null)
interface ChatProps {
  ws: WebSocket | null;
}

interface MessageType {
  id: string;
  text: string;
  senderId: string;
}

const Chat: React.FC<ChatProps> = ({ ws }) => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState<MessageType[]>([]);

  // Listen for incoming messages from the WebSocket server
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data); // Assuming the server sends a JSON object with id, text, and senderId
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
    }
  }, [ws]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      {/* Pass the messages array to Messages component */}
      <Messages messages={messages} />
      <Input ws={ws} />
    </div>
  );
};

export default Chat;
