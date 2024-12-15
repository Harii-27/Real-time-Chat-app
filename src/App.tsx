import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import the custom hook
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

const App = () => {
  const { currentUser } = useAuth(); // Access the fixed currentUser from AuthContext
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // WebSocket connection logic (already shared in your previous code)
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://localhost:5000");

      socket.onopen = () => {
        console.log("WebSocket connected");
        setError(null);
      };

      socket.onmessage = (message) => {
        console.log("Received message:", message.data);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection failed.");
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
        setTimeout(connectWebSocket, 5000);
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home ws={ws} />} />
        <Route path="/login" element={<Login ws={ws} />} />
        <Route path="/register" element={<Register ws={ws} />} />
      </Routes>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
    </BrowserRouter>
  );
};

export default App;
