import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isChatAllowed: false,
  isWhatsappChatAllowed: false,
  unreadCount: 0,
  isSyncWithGoogleAllowed: false,
  googleSyncedData: null,
  googleClientIdForIOS: "",
  googleClientIdForAndriod: "",
  googleClientIdForWeb: "",
  access: null,
  feedSettings: null,
  S3_URL: "",
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
      state.googleClientIdForIOS = action.payload.googleClientIdIOS;
      state.googleClientIdForAndriod = action.payload.googleClientIdAndroid;
      state.googleClientIdForWeb = action.payload.googleClientIdWeb;
      state.isSyncWithGoogleAllowed = action.payload.isSyncWithGoogleAllowed;
      state.googleSyncedData = action.payload.googleSyncedData;
      state.access = action.payload.access;
      state.feedSettings = action.payload.feedSettings;
      state.S3_URL = action.payload.S3_URL;
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
    },
    setS3Url: (state) => {
      state.S3_URL = state;
    }
  }
})
export const { setConsultant,
  clearUser, setUserAndToken,
  clearUserAndToken, setUnReadCount,
  setGoogleSyncedData, removeGoogleSyncedData,
  googleClientIdForIOS, googleClientIdForAndriod,
  googleClientIdForWeb, access, feedSettings, setS3Url
} = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
