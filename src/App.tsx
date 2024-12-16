import { useSelector } from "react-redux";
import { RootState } from "./Store/main";
import { useWeb } from "./hooks/useWeb";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; 
import React from "react";
import Login from "./components/Login";
import MessageBox from "./components/Message";
import Members from "./components/Name";

function App() {
  // Get current user from Redux state
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);

  // Initialize socket with current user
  useWeb(currentUser);

  // If no user is logged in, display the Login component
  if (!currentUser) {
    return <Login />;
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
              <Members />
            </div>

          
            <div className="chat-window">
              <MessageBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
