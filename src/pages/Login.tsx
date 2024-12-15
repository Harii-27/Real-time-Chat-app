import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginProps {
  ws: WebSocket | null;
}

const Login: React.FC<LoginProps> = ({ ws }) => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
    const password = (e.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = { type: "LOGIN", email: email.value, password: password.value };
      ws.send(JSON.stringify(payload));

      // Handle WebSocket response
      ws.onmessage = (message) => {
        const response = JSON.parse(message.data);
        console.log("Response from server:", response);  // Debugging the response
        if (response.status === "success") {
          // Redirect to home page if login is successful
          navigate("/");
        } else {
          // Show error message if login fails
          setErr(true);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error during login:", error);
        setErr(true);
      };
    } else {
      console.error("WebSocket is not connected.");
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Sign in</button>
          {err && <span style={{ color: "red" }}>Login failed. Invalid credentials.</span>}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
