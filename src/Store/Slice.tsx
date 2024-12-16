import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Message } from '../types';

interface ChatState {
  currentUser: User | null;
  selectedUser: User | null;
  users: User[];
  messages: Message[];
  usersOrder: string[]; 
}

const initialState: ChatState = {
  currentUser: null,
  selectedUser: null,
  users: [],
  messages: [],
  usersOrder: [], 
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Reducer to update the order of users
    setUsersOrder: (state, action: PayloadAction<string[]>) => {
      state.usersOrder = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setSelectedUser,
  setUsers,
  addMessage,
  setMessages,
  setUsersOrder,
} = chatSlice.actions;
export default chatSlice.reducer;
