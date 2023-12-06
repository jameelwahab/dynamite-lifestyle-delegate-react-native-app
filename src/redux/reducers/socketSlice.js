import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    clearSocket: (state) => {
      state.socket = {}
    },

  }
})
export const { setSocket, clearSocket } = socketSlice.actions;
export const selectSocket = (state) => state.socket;
export default socketSlice.reducer;