import React from 'react';
import { FaUser, FaTh, FaCog, FaPowerOff } from 'react-icons/fa';
import { HiMenuAlt2 } from "react-icons/hi";
import { BiMessageSquareMinus } from "react-icons/bi";
import './Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="icon">
        <FaPowerOff className="iconSvg" /> 
      </div>
      <div className="icon">
        <BiMessageSquareMinus className="iconSvg" /> 
      </div>
      <div className="icon">
        <FaUser className="iconSvg" /> 
      </div>
      <div className="icon">
        <FaTh className="iconSvg" /> 
      </div>
      <div className="icon iconBottom">
        <FaCog className="iconSvg" /> 
      </div>
      <div className="icon">
        <HiMenuAlt2 className="iconSvg" />
      </div>
    </div>
  );
};

export default Sidebar;
