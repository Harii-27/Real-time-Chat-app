import { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import React from "react";

interface InputProps {
  ws: WebSocket | null; // WebSocket passed as a prop
}

const Input: React.FC<InputProps> = ({ ws }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<File | null>(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (ws) {
      // Construct the message object
      const message = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Date.now(), // You can use Timestamp.now() in Firebase, here we use Date.now()
        img: img ? URL.createObjectURL(img) : null, // For image preview, or you can upload the image first and use its URL
      };

      // Send the message over WebSocket
      const messagePayload = {
        type: "sendMessage",
        chatId: data.chatId,
        message,
      };

      // Send the message to the WebSocket server
      ws.send(JSON.stringify(messagePayload));

      // Optionally, clear the input fields after sending
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
