import MessageList from "../../screens/Chat/MessageList.js";
import ChangePassword from "../../screens/Profile/ChangePassword";
import EditProfile from "../../screens/Profile/EditProfile";
import OtherSettings from "../../screens/Settings/OtherSettings";
import ReminderSettings from "../../screens/Settings/ReminderSettings";
import ZoomSettings from "../../screens/Settings/ZoomSettings";
import routes from "../routes";


export const defaultScreens = [
  {
    name: routes.otherSettings,
    component: OtherSettings
  },
  {
    name: routes.editProfile,
    component: EditProfile
  },
  {
    name: routes.changePassword,
    component: ChangePassword
  },
  {
    name: routes.zoomSettings,
    component: ZoomSettings
  },
  {
    name: routes.reminderSettings,
    component: ReminderSettings
  },
  {
    name: routes.chatMessageList,
    component: MessageList
  }

]