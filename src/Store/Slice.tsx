import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Message } from '../types';

interface State {
  currentUser: User | null;
  selectedUser: User | null;
  users: User[];
  messages: Message[];
  usersOrder: string[];
}

const initialSliceState: State = {
  currentUser: null,
  selectedUser: null,
  users: [],
  messages: [],
  usersOrder: [],
};

const slice = createSlice({
  name: 'slice',
  initialState: initialSliceState,
  reducers: {
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
     selectActiveUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
    updateUserList: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    replaceMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Reducer to update the order of users
     reorderUsers: (state, action: PayloadAction<string[]>) => {
      state.usersOrder = action.payload;
    },
  },
});

export const {
  updateCurrentUser,
   selectActiveUser,
  updateUserList,
  appendMessage,
  replaceMessages,
   reorderUsers,
} = slice.actions;

export default slice.reducer;
