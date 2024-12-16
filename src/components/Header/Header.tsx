import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { FaSearch } from "react-icons/fa"; // Importing the search icon from react-icons
import './Header.css'; // Use the regular CSS file instead of CSS module

const Header = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);

  if (!currentUser) {
    return null; // If no user is logged in, don't render the header
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="header">
      {/* Left side: Search bar */}
      <div className="searchContainer">
        <FaSearch className="searchIcon" /> {/* React Icon used here */}
        <input
          type="text"
          placeholder="Search contacts, messages"
          className="searchInput"
          value={searchQuery} // Bind the input field value to the state
          onChange={handleSearchChange} // Update the state when input changes
        />
      </div>

      {/* Right side: Profile */}
      <div className="profileContainer">
        {/* Profile Info */}
        <div className="profileInfo">
          <p className="profileName">{currentUser.name}</p>
          <p className="profileStatus">
            {currentUser.online && <span className="onlineDot"></span>}
            {currentUser.online ? "Online" : "Offline"}
          </p>
        </div>

        {/* Profile Avatar */}
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="profileAvatar"
        />
      </div>
    </div>
  );
};

export default Header;
