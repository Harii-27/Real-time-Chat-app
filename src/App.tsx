import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

const App = () => {
  const { currentUser } = useContext(AuthContext) as { currentUser: any };
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null); // To track WebSocket connection errors

  useEffect(() => {
    // Function to handle WebSocket connection
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://localhost:5000");

      socket.onopen = () => {
        console.log("WebSocket connected");
        setError(null); // Reset error if WebSocket connects successfully
      };

      socket.onmessage = (message) => {
        console.log("Received message:", message.data);
      };

      socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection failed. Please try again.");
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
        setError("WebSocket closed. Reconnecting...");
        // Retry connecting after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      setWs(socket); // Store WebSocket in state for later use
    };

    // Try to establish WebSocket connection
    connectWebSocket();

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array ensures the WebSocket connects only once

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass ws as a prop to Home, Login, and Register components */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home ws={ws} />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login ws={ws} />} />
        <Route path="register" element={<Register ws={ws} />} />
      </Routes>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
    </BrowserRouter>
  );
};

export default App;
