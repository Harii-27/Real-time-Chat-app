import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types
interface AuthContextType {
  currentUser: { uid: string; displayName: string; photoURL?: string } | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<{ uid: string; displayName: string; photoURL?: string } | null>>;
}

// Create context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Set a permanent user by default
  const [currentUser, setCurrentUser] = useState<{ uid: string; displayName: string; photoURL?: string } | null>({
    uid: '12345', // Permanent UID
    displayName: 'Harii', // Permanent display name
    photoURL: 'https://example.com/photo.jpg', // Optional photo URL
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
