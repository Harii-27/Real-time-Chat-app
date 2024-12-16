import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../Store/Slice";
import { User } from "../../types";
import defaultAvatar from '../../img/virat.png'; // Import the default avatar
import "./Login.css"; // Import the provided CSS

// Single dummy user
const dummyUser: User = {
  id: "1",
  name: "Harii",
  avatar: defaultAvatar,  
  online: true,
};

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(dummyUser.name); // Pre-fill with the dummy user name
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login functionality
  const handleLogin = () => {
    if (username.trim()) {
      dispatch(setCurrentUser({ ...dummyUser, name: username }));
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="user-select-wrapper">
      {!isLoggedIn ? (
        <div className="login-container">
          <h1 className="login-heading">Login</h1>

          {/* Display avatar */}
          <img src={dummyUser.avatar} alt={dummyUser.name} className="login-avatar" />

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
        <div className="user-select-wrapper">
          <h1 className="user-select-heading">Welcome, {username}</h1>
          <div className="user-select-list">
            <div
              onClick={() => dispatch(setCurrentUser(dummyUser))}
              className="user-select-item"
            >
              <img src={dummyUser.avatar} alt={dummyUser.name} className="user-avatar" />
              <p className="user-name">{dummyUser.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
