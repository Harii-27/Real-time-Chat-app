import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

// Define the type for the props (with ws as WebSocket or null)
interface SidebarProps {
  ws: WebSocket | null;
}

const Sidebar: React.FC<SidebarProps> = ({ ws }) => {
  return (
    <div className="sidebar">
      {/* Passing ws prop to Navbar, Search, and Chats components */}
      <Navbar ws={ws} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <Search ws={ws} />
      <Chats ws={ws} />
    </div>
  );
};

export default Sidebar;
