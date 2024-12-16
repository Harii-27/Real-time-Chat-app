import { useEffect } from 'react';
import { messageService } from '../web/web';
import { User } from '../types';

export const useWeb = (currentUser: User | null) => {
  useEffect(() => {
    if (currentUser?.id) {
      messageService.connect(currentUser);

      return () => {
        messageService.disconnect();
      };
    }
  }, [currentUser]);
};
