import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface RegisterProps {
  ws: WebSocket | null;
}

const Register: React.FC<RegisterProps> = ({ ws }) => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const displayName = (e.target as HTMLFormElement).elements.namedItem('displayName') as HTMLInputElement;
    const email = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
    const password = (e.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

    if (ws) {
      const payload = { type: "REGISTER", displayName: displayName.value, email: email.value, password: password.value };
      console.log("Sending payload to server:", payload);

      ws.send(JSON.stringify(payload));

      ws.onmessage = (message) => {
        console.log("Received message from server:", message.data);
        const response = JSON.parse(message.data);
        setLoading(false);
        if (response.status === "success") {
          navigate("/login");
        } else {
          console.error("Registration failed:", response.message);
          setErr(true);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error during registration:", error);
        setErr(true);
        setLoading(false);
      };
    } else {
      console.error("WebSocket is not connected.");
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign up"}
          </button>
          {err && <span>Registration failed. Please try again.</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
