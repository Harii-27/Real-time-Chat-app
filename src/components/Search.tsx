import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Define the type for user (based on your requirements)
interface UserType {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface SearchProps {
  ws: WebSocket | null;
}

const Search: React.FC<SearchProps> = ({ ws }) => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [err, setErr] = useState(false);

  const authContext = useContext(AuthContext);

  const handleSearch = () => {
    if (ws && username) {
      const searchMessage = JSON.stringify({
        type: "searchUser", // You can define a message type for searching
        username,
      });

      ws.send(searchMessage); // Send search request via WebSocket

      // Listen for search result
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.success) {
          setUser(response.user); // Set user if found
        } else {
          setErr(true); // Set error if user is not found
        }
      };
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") handleSearch();
  };

  const handleSelect = () => {
    if (ws && user && authContext && authContext.currentUser) {
      // Handle selecting a user (e.g., creating a new chat)
      const combinedId = authContext.currentUser.uid > user.uid ? authContext.currentUser.uid + user.uid : user.uid + authContext.currentUser.uid;
      const chatMessage = JSON.stringify({
        type: "createChat",
        combinedId,
        currentUser: authContext.currentUser,
        user,
      });

      ws.send(chatMessage); // Send create chat request via WebSocket
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Search;
