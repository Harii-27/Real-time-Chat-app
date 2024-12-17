import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveUser } from '../Store/Slice';
import { AppState } from '../Store/main';
import { User } from '../types';
import './components.css';
import defaultAvatar from '../img/1651837230260.png';

const Members = () => {
  const dispatch = useDispatch();
  const { users, currentUser, selectedUser } = useSelector((state: AppState) => state.message);

 
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

 
  const filteredUsers = React.useMemo(() => [
    ...defaultUsers,
    ...users.filter(user => user.id !== currentUser?.id)
  ], [users, currentUser]);

 
  const handleUserClick = (user: User) => {
    dispatch(selectActiveUser(user));
  };

  // Automatically select "Codescribo" if no user is selected (on page load)
  useEffect(() => {
    if (!selectedUser) {
      const codescriboUser = defaultUsers.find(user => user.name === 'Codescribo');
      if (codescriboUser) {
        dispatch(selectActiveUser(codescriboUser));
      }
    }
  }, [dispatch, selectedUser, defaultUsers]);

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
