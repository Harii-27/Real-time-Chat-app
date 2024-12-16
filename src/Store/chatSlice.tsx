import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Message } from '../types';

interface ChatState {
  currentUser: User | null;
  selectedUser: User | null;
  users: User[];
  messages: Message[];
}

const initialState: ChatState = {
  currentUser: null,
  selectedUser: null,
  users: [],
  messages: [],
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
  },
});

export const { setCurrentUser, setSelectedUser, setUsers, addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
