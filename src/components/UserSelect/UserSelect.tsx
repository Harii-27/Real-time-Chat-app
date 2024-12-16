import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../Store/chatSlice";
import { User } from "../../types";
import "./UserSelect.css";
import React from "react";

const sampleUser: User[] = [
  {
    id: "1",
    name: "User 1",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    online: true,
  },
  {
    id: "2",
    name: "User 2",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    online: true,
  },
 
];

export default function UserSelect() {
  const dispatch = useDispatch();

  const handleSelectUser = (user: User) => {
    dispatch(setCurrentUser(user));
  };

  return (
    <div className="user-select-wrapper">
      <h1 className="user-select-heading">Select a user</h1>
      <div className="user-select-list">
        {sampleUser.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className="user-select-item"
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <p className="user-name">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
