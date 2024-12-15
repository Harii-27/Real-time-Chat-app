import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

// Define types for the message prop
interface MessageType {
  id: string;
  text: string;
  senderId: string;
  img?: string;
}

interface MessageProps {
  message: MessageType; // Expect a single message of type MessageType
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const authContext = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  if (!authContext || !authContext.currentUser) {
    return null; // Return null if currentUser is not available
  }

  const { currentUser } = authContext;

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL || "" // Use currentUser's photoURL if it's the sender
              : data?.user?.photoURL || "" // Use the chat's user photoURL if it's not the sender
          }
          alt="User"
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="Attached" />}
      </div>
    </div>
  );
};
export default Message;
