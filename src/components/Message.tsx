import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

// Define the type for the message prop
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
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser?.uid ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser?.uid
              ? currentUser?.photoURL || ""
              : data?.user?.photoURL || ""
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
