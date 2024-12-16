import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/main";
import { FaSearch } from "react-icons/fa";
import './components.css';

const Header = () => {
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  const [searchQuery, setSearchQuery] = useState("");


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

 
  if (!currentUser) return null;

  const { name, avatar, online } = currentUser;

  return (
    <div className="header">

      <div className="searchBox">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Search contacts, messages and options here"
          className="searchInput"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>


        <div className="profileBox">
        <div className="profiledetails">
          <p className="profileName">{name}</p>
          <p className="profileStatus">
            {online && <span className="online-dot"></span>}
            {online ? "Online" : "Offline"}
          </p>
        </div>
        <img src={avatar} alt={name} className="profileAvatar" />
      </div>
    </div>


  );
};

export default Header;
