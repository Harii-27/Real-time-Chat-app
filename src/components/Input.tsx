import { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import React from "react";

// Define the InputProps type for WebSocket prop
interface InputProps {
  ws: WebSocket | null;
}

const Input: React.FC<InputProps> = ({ ws }) => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  // Safely access currentUser from AuthContext
  const { currentUser } = useContext(AuthContext) || { currentUser: null }; // Fallback to null if AuthContext is undefined
  const { data } = useContext(ChatContext);

  // Handle send button click
  const handleSend = async () => {
    if (!currentUser) {
      // If currentUser is not available, show an error or handle appropriately
      console.error("No current user available");
      return;
    }

    if (ws) {
      // Construct the message object
      const message = {
        id: uuid(),
        text,
        senderId: currentUser.uid, // Use currentUser's UID safely
        date: Date.now(), // Use timestamp
        img: img ? URL.createObjectURL(img) : null, // Handle image file
      };

      // Send the message over WebSocket
      const messagePayload = {
        type: "sendMessage",
        chatId: data.chatId,
        message,
      };

      // Send the message to the WebSocket server
      ws.send(JSON.stringify(messagePayload));

      // Clear input fields after sending
      setText("");
      setImg(null);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="Attach" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor="file">
          <img src={Img} alt="Add Image" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
