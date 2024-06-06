import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isChatAllowed: false,
  isWhatsappChatAllowed: false,
  unreadCount: 0,
  isSyncWithGoogleAllowed: false,
  googleSyncedData: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setConsultant: (state, action) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    },
    setUserAndToken: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isChatAllowed = action.payload.isChatAllowed;
      state.isWhatsappChatAllowed = action.payload.isWhatsappChatAllowed;
      state.unreadCount = action.payload.count;
      state.isSyncWithGoogleAllowed = action.payload.isSyncWithGoogleAllowed;
      state.googleSyncedData = action.payload.googleSyncedData;
    },
    clearUserAndToken: (state) => {
      state = {
        user: null,
        token: ""
      };
    },
    setUnReadCount: (state, action,) => {
      state.unreadCount = action.payload
    },
    setGoogleSyncedData: (state, action,) => {
      state.googleSyncedData = action.payload;
    },
    removeGoogleSyncedData: (state,) => {
      state.googleSyncedData = null;
    }
  }
})
export const { setConsultant, clearUser, setUserAndToken, clearUserAndToken, setUnReadCount, setGoogleSyncedData, removeGoogleSyncedData } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;