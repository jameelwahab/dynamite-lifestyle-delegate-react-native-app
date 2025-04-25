import MessageList from "../../screens/Chat/MessageList.js";
import NotificationList from "../../screens/NotificationList";
import ChangePassword from "../../screens/Profile/ChangePassword";
import FeedKeywords from "../../screens/Profile/FeedKeywords";
import ScheduleNotifications from "../../screens/Profile/ScheduleNotifications";
import EditProfile from "../../screens/Profile/EditProfile";
import ChangeAffiliateId from "../../screens/Settings/ChangeAffiliateId.js";
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
    name: routes.feedKeywords,
    component: FeedKeywords
  },
  // {
  //   name: routes.scheduleNotifications,
  //   component: ScheduleNotifications
  // },
  {
    name: routes.chatMessageList,
    component: MessageList
  },
  {
    name: routes.notificationList,
    component: NotificationList
  },
  {
    name: routes.changeAffiliateIdScreen,
    component: ChangeAffiliateId
  }

]
