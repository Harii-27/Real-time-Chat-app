import React from 'react';
import { FaUser, FaTh, FaCog, FaPowerOff } from 'react-icons/fa';
import { HiMenuAlt2 } from "react-icons/hi";
import { BiMessageSquareMinus } from "react-icons/bi";

const Sidebar = () => {

  const sidebarStyle: React.CSSProperties = {
    width: '64px',
    backgroundColor: '#565CCE',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
    gap: '16px',
  };

  const iconStyle: React.CSSProperties = {
    color: '#fff',
    cursor: 'pointer',
    transition: 'color 0.3s',
  };

  const iconActiveStyle: React.CSSProperties = {
    color: '#ffffff',
  };

  const iconSvgStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };

  const iconBottomStyle: React.CSSProperties = {
    marginTop: 'auto',
  };

  return (
    <div style={sidebarStyle}>
      <div style={iconStyle}>
        <FaPowerOff style={iconSvgStyle} className="iconSvg" />
      </div>
      <div style={iconStyle}>
        <BiMessageSquareMinus style={iconSvgStyle} className="iconSvg" />
      </div>
      <div style={iconStyle}>
        <FaUser style={iconSvgStyle} className="iconSvg" />
      </div>
      <div style={iconStyle}>
        <FaTh style={iconSvgStyle} className="iconSvg" />
      </div>
      <div style={{ ...iconStyle, ...iconBottomStyle }}>
        <FaCog style={iconSvgStyle} className="iconSvg" />
      </div>
      <div style={iconStyle}>
        <HiMenuAlt2 style={iconSvgStyle} className="iconSvg" />
      </div>
    </div>
  );
};
export default Sidebar;
