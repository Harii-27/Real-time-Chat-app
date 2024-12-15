import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginProps {
  ws: WebSocket | null;
}

const Login: React.FC<LoginProps> = ({ ws }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (ws) {
      // Send login credentials to the WebSocket server
      ws.send(
        JSON.stringify({
          type: "LOGIN",
          email,
          password,
        })
      );
    }
  };

  // Listen for server responses to login
  ws?.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "LOGIN_SUCCESS") {
      navigate("/"); // Redirect to the home page after successful login
    } else if (message.type === "LOGIN_ERROR") {
      setErr(true); // Display error message on login failure
    }
  });

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign in</button>
          {err && <span className="error">Invalid email or password</span>}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
