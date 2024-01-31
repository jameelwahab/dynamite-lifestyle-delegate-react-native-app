import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isChatAllowed: false,
  isWhatsappChatAllowed: false,
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
    setUserAndToken: (state, action,) => {
       console.log(action,"action")
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isChatAllowed = action.payload.isChatAllowed;
      state.isWhatsappChatAllowed = action.payload.isWhatsappChatAllowed;
    },
    clearUserAndToken: (state) => {
      state = {
        user: null,
        token: ""
      };
    }
  }
})
export const { setConsultant, clearUser, setUserAndToken, clearUserAndToken } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;