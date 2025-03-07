import { IS_CHAT_EXIST } from "../DAL";
import routes from "../navigation/routes";


export const onChatScreen = async (memberId, token, navigation, userId) => {
  let res = await IS_CHAT_EXIST({ token, navigation, memberId })
  if (res.code == 200) {
    if (res.is_chat_exist) {
      let member = res.chat.member.find(x => x._id != userId)
      navigation.navigate(routes.chatMessageList, {
        isOnline: member?.is_online,
        memberId: member?._id,
        firstName: member?.first_name,
        lastName: member?.last_name,
        lastSeen: "",
        profileImage: !!member?.profile_image ? member?.profile_image : "",
        chatId: res?.chat?._id,
        canGoBack: true,
        resetCountToZero: () => { },
        refresh: () => { },
      })
    } else {
      let member = res.user_info;
      navigation.navigate(routes.chatMessageList, {
        isOnline: member?.is_online,
        memberId: member?._id,
        firstName: member?.first_name,
        lastName: member?.last_name,
        lastSeen: !!member?.last_login_activity ? member?.last_login_activity : "",
        profileImage:  member?.profile_image?.thumbnail_1 ||  "",
        chatId: "",
        canGoBack: true,
        resetCountToZero: () => { },
        refresh: () => { },
      })
    }
  }
}
