import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { useNavigate, Link } from "react-router-dom";

interface RegisterProps {
  ws: WebSocket | null;
}

const Register: React.FC<RegisterProps> = ({ ws }) => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const displayName = (form[0] as HTMLInputElement).value;
    const email = (form[1] as HTMLInputElement).value;
    const password = (form[2] as HTMLInputElement).value;
    const file = (form[3] as HTMLInputElement).files?.[0];

    if (ws) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const avatarData = reader.result as string;

          // Send registration data to the WebSocket server
          ws.send(
            JSON.stringify({
              type: "REGISTER",
              displayName,
              email,
              password,
              avatar: avatarData, // Send the avatar image as a Base64 string
            })
          );
        };

        if (file) {
          reader.readAsDataURL(file);
        } else {
          // Send registration data without avatar
          ws.send(
            JSON.stringify({
              type: "REGISTER",
              displayName,
              email,
              password,
              avatar: null,
            })
          );
        }
      } catch (err) {
        setErr(true);
        setLoading(false);
      }
    }

    // Listen for registration response from the WebSocket server
    ws?.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "REGISTER_SUCCESS") {
        navigate("/"); // Redirect to the home page on success
      } else if (message.type === "REGISTER_ERROR") {
        setErr(true);
        setLoading(false);
      }
    });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="Avatar" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image, please wait..."}
          {err && <span className="error">Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
