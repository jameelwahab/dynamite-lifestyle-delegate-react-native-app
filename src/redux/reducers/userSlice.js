import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isChatAllowed: false,
  isWhatsappChatAllowed: false,
  unreadCount: 0,
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
      console.log(action, "action")
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isChatAllowed = action.payload.isChatAllowed;
      state.isWhatsappChatAllowed = action.payload.isWhatsappChatAllowed;
      state.unreadCount = action.payload.count
    },
    clearUserAndToken: (state) => {
      state = {
        user: null,
        token: ""
      };
    },
    setUnReadCount: (state, action,) => {
      state = {
        unreadCount: action?.payload?.count
      };
    }
  }
})
export const { setConsultant, clearUser, setUserAndToken, clearUserAndToken, setUnReadCount } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;