import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import navbarSlice from './reducers/navbarSlice'
import settingSlice from './reducers/settingSlice'
import timezoneSlice from './reducers/timezoneSlice'
import socketSlice from './reducers/socketSlice'


export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  reducer: {
    user: userReducer,
    navbar: navbarSlice,
    settings: settingSlice,
    timezone: timezoneSlice,
    socket: socketSlice
  },
})