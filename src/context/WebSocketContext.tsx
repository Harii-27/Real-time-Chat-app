// src/context/WebSocketContext.tsx
import React, { createContext, useState, useEffect } from "react";

// Create WebSocket context
export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
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

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};
