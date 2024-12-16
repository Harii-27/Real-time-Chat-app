import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../Store/Slice';
import { RootState } from '../Store/main';
import { User } from '../types';
import './components.css';
import defaultAvatar from '../img/1651837230260.png';

const Members = () => {
  const dispatch = useDispatch();
  const { users, currentUser, selectedUser } = useSelector((state: RootState) => state.chat);

  // Define multiple users like Codescribo
  const defaultUsers: User[] = React.useMemo(() => [
    {
      id: '1',
      name: 'Codescribo',
      avatar: defaultAvatar,
      online: true,
    },
    {
      id: '2',
      name: 'Shunmugam',
      avatar: defaultAvatar,
      online: true,
    },
    {
      id: '3',
      name: 'Sac',
      avatar: defaultAvatar,
      online: true,
    },
    {
      id: '4',
      name: 'Ganesh',
      avatar: defaultAvatar,
      online: false,
    },
  ], []);

  // Filter out the current user and merge with predefined users
  const filteredUsers = React.useMemo(() => [
    ...defaultUsers,
    ...users.filter(user => user.id !== currentUser?.id)
  ], [users, currentUser]);

  const handleUserClick = (user: User) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div className="members">
      {filteredUsers.map((user) => {
        const isSelected = selectedUser?.id === user.id;
        const userStatus = user.online ? 'Online' : 'Offline';
        return (
          <div
            key={user.id}
            className={`membersName ${isSelected ? 'membersNameSelected' : ''}`}
            onClick={() => handleUserClick(user)}
          >
            <img src={user.avatar} alt={user.name} className="userAvatar" />
            <div className="userInfo">
              <p className={`userName ${isSelected ? 'userNameSelected' : ''}`}>{user.name}</p>
              <p className={`userStatus ${isSelected ? 'userStatusSelected' : ''}`}>{userStatus}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
