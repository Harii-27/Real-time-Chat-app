import { WebSocketServer } from "ws";

// Port for WebSocket server
const WEBSOCKET_PORT = 5000;

// Create the WebSocket server
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

const users = []; // Temporary storage for registered users (use a database in production)

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "REGISTER") {
      const { displayName, email, password } = data;

      // Basic validation
      if (!displayName || !email || !password) {
        ws.send(
          JSON.stringify({
            status: "error",
            message: "Missing required fields",
          })
        );
        return;
      }

      // Check if email already exists
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        ws.send(
          JSON.stringify({
            status: "error",
            message: "Email already registered",
          })
        );
        return;
      }

      // Add user to storage
      users.push({ displayName, email, password });

      // Send success response
      ws.send(
        JSON.stringify({
          status: "success",
          message: "Registration successful",
        })
      );
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
