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

  useEffect(() => {
    // Initialize WebSocket connection only once when the app starts
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (message) => {
      console.log("Received message:", message.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    // Set WebSocket to state after it's connected
    setWs(socket);

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // Empty dependency array to initialize WebSocket once

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
    </BrowserRouter>
  );
};
export default App;
