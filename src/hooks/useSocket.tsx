import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { User } from '../types';

export const useSocket = (currentUser: User | null) => {
  useEffect(() => {
    if (currentUser?.id) {
      socketService.connect(currentUser); // Ensure currentUser object is passed correctly

      return () => {
        socketService.disconnect();
      };
    }
  }, [currentUser]); // Ensure this runs when currentUser changes
};
