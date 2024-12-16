import { useSelector } from "react-redux";
import { RootState } from "./Store";
import UserSelect from "./components/UserSelect/UserSelect";
import ChatList from "./components/ChatList/Chatlist";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { useSocket } from "./hooks/useSocket";
import "./index.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header"; // Import Header
import React from "react";

function App() {
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  useSocket(currentUser);

  if (!currentUser) {
    return <UserSelect />;
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          {/* Header - Positioned inside the main content */}
          <Header />

          <div className="content-body">
            {/* Chat List */}
            <div className="chat-list-container">
              <ChatList />
            </div>

            {/* Chat Window */}
            <div className="chat-window">
              <ChatWindow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
