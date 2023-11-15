import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const navbarSlice = createSlice({
  name: "navbar",
  initialState: initialState,
  reducers: {
    setNavbar: (state, action) => {
      state.navbar = action.payload
    },
    clearNavbar: (state) => {
      state.navbar = {}
    },

  }
})
export const { setNavbar, clearNavbar } = navbarSlice.actions;
export const selectNavbar= (state) => state.navbar;
export default navbarSlice.reducer;