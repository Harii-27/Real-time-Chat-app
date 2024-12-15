import { WebSocketServer } from "ws";

// Port for WebSocket server
const WEBSOCKET_PORT = 5000;

// Create the WebSocket server
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

// Predefined valid credentials
const validEmail = "user@example.com";
const validPassword = "password123";

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Received message:", data);

    // Handle login request
    if (data.type === "LOGIN") {
      const { email, password } = data;

      if (email === validEmail && password === validPassword) {
        // Valid credentials: Send success response
        ws.send(
          JSON.stringify({
            status: "success",
            message: "Login successful",
          })
        );
      } else {
        // Invalid credentials: Send error response
        ws.send(
          JSON.stringify({
            status: "error",
            message: "Invalid credentials",
          })
        );
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log(`WebSocket server is running on ws://localhost:${WEBSOCKET_PORT}`);
