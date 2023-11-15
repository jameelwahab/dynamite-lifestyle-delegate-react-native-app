import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload
    },
    clearSettings: (state) => {
      state.settings = {}
    },

  }
})
export const { setSettings, clearSettings } = settingsSlice.actions;
export const selectSettings = (state) => state.settings;
export default settingsSlice.reducer;