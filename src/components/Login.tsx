import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../Store/Slice";
import { User } from "../types";
import defaultAvatar from '../img/virat.png'; // Import the default avatar
import './components.css';


const mainUser: User = {
  id: "1",
  name: "Harii",
  avatar: defaultAvatar,
  online: true,
};

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(mainUser.name); // Pre-fill with the dummy user name
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login functionality
  const handleLogin = () => {
    if (username.trim()) {
      dispatch(updateCurrentUser({ ...mainUser, name: username }));
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="mainUser-container">
      {!isLoggedIn ? (
        <div className="login-container">
          <h1 className="login-heading">Login</h1>

          {/* Display avatar */}
          <img src={mainUser.avatar} alt={mainUser.name} className="login-avatar" />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Handle input changes
            placeholder="Enter your username"
            className="username-input"
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
      ) : (
        <div className="mainUser-container">
          <h1 className="mainUser-details1">Welcome, {username}</h1>
          <div className="user-select-list">
            <div
              onClick={() => dispatch(updateCurrentUser(mainUser))}
              className="user-select-item"
            >
              <img src={mainUser.avatar} alt={mainUser.name} className="user-avatar" />
              <p className="user-name">{mainUser.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
