import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import navbarSlice from './reducers/navbarSlice'
import settingSlice from './reducers/settingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    navbar:navbarSlice,
    settings:settingSlice
  },
})