import React from "react";
import Message from "./Message"; // Import the Message component

// Define the type for a single message (adjusted to your structure)
interface MessageType {
  id: string;
  text: string;
  senderId: string;
  img?: string;
}

interface MessagesProps {
  messages: MessageType[]; // Expect an array of messages
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} /> // Use the imported Message component
      ))}
    </div>
  );
};

export default Messages;
