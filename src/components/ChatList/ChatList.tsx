import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../../Store/chatSlice';
import { RootState } from '../../Store';
import { User } from '../../types';
import './ChatList.css';
import '../../index.css';
// Import the image for the default user
import defaultAvatar from '../../img/1651837230260.png';  // Update this path based on your actual file structure

export default function ChatList() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.chat.users);
  const currentUser = useSelector((state: RootState) => state.chat.currentUser);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);

  // Default user with the imported image as avatar
  const defaultUser: User = {
    id: '1',
    name: 'Codescribo',
    avatar: defaultAvatar,  // Using the imported image
    online: true,
  };

  // Filter users to exclude the current user and add the default user at the top
  const filteredUsers = [defaultUser, ...users.filter(user => user.id !== currentUser?.id)];

  return (
    <div className="chatList">
      {filteredUsers.map((user: User) => (
        <div
          key={user.id}
          onClick={() => dispatch(setSelectedUser(user))}
          className={`chatItem ${selectedUser?.id === user.id ? 'chatItemSelected' : ''}`}
        >
          <img src={user.avatar} alt={user.name} className="userAvatar" />
          <div className="userInfo">
            <p className={`userName ${selectedUser?.id === user.id ? 'userNameSelected' : ''}`}>
              {user.name}
            </p>
            <p className={`userStatus ${selectedUser?.id === user.id ? 'userStatusSelected' : ''}`}>
              {user.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
