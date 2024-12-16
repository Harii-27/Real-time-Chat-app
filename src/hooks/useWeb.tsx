import { useEffect } from 'react';
import { chatService } from '../web/web';  
import { User } from '../types';

export const useWeb = (currentUser: User | null) => {
  useEffect(() => {
    if (currentUser?.id) {
      chatService.connect(currentUser); 

      return () => {
        chatService.disconnect(); 
      };
    }
  }, [currentUser]);
};
