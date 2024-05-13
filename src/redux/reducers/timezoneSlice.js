import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  admin: ""
}
const timezoneSlice = createSlice({
  name: "timezone",
  initialState: initialState,
  reducers: {
    setTimeZone: (state, action) => {
      state.user = action.payload.user
      state.admin = action.payload.admin
    },
    setUserTimeZone: (state, action) => {
      state.user = action.payload
    },
    clearTimeZone: (state) => {
      state.user = "",
        state.admin = ""
    },
  }
})
export const { setTimeZone, clearTimeZone, setUserTimeZone } = timezoneSlice.actions;
export const selectTimeZone = (state) => state.timezone;
export default timezoneSlice.reducer;