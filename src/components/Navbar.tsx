import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface NavbarProps {
  ws: WebSocket | null; // Add ws to the component's props
  onLogout: () => void; // Callback function for logout action
}

const Navbar: React.FC<NavbarProps> = ({ ws, onLogout }) => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    // Close WebSocket connection when logging out
    if (ws) {
      ws.close();
      console.log('WebSocket connection closed');
    }

    // Call the onLogout prop function to handle the logout action
    onLogout();
  };

  return (
    <div className='navbar'>
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img src={currentUser?.photoURL || ''} alt="User" />
        <span>{currentUser?.displayName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
