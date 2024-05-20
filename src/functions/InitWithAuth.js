import { INIT_WITH_TOKEN } from '../DAL';
import { setSettings } from '../redux/reducers/settingSlice';
import { setUserAndToken } from '../redux/reducers/userSlice';
import { setNavbar } from '../redux/reducers/navbarSlice';
import { setTimeZone } from '../redux/reducers/timezoneSlice';
import { setSocket } from '../redux/reducers/socketSlice';
import routes from '../navigation/routes';
import { io } from 'socket.io-client';
import { socketUrl } from '../utilities/constants';
import notifee from '@notifee/react-native';

const InitWithAuth = async (token, navigation, setLoader, dispatch) => {
  let res = await INIT_WITH_TOKEN({ token: token });
  if (res.code == 200) {
    let isChatAllowed = false;
    let isWhatsappChatAllowed = false;
    res?.nav_items.forEach(item => {
      console.table(item.title + "  --->  ", item.value, item)
      if (item.value == "chat") {
        isChatAllowed = true;
      } else if (item.value == "whatsapp_chat") {
        isWhatsappChatAllowed = true
      }
    })
    let stripeKey = "";
    if (res?.site_setting?.stripe_mode == "sandBox") {
      stripeKey = res?.site_setting?.sandBox_publish_key
    } else if (res?.site_setting?.stripe_mode == "live") {
      stripeKey = res?.site_setting?.live_publish_key
    }
    notifee.setBadgeCount(res?.unread_notification_count)
    dispatch(setSettings({ ...res?.consultant_setting, stripeKey: stripeKey }));
    dispatch(setUserAndToken({ user: res?.consultant, token: token, isChatAllowed, isWhatsappChatAllowed, count: res?.unread_notification_count }));
    dispatch(setNavbar(res?.nav_items));
    dispatch(setTimeZone({ user: res?.consultant?.time_zone, admin: res?.time_zone }))
    dispatch(setSocket(io(socketUrl, {
      query: {
        user_id: res?.consultant?._id,
        role: "delegate"
      }
    })))
    navigation.reset({
      index: 0,
      routes: [{ name: routes.mainScreen }]
    })
    return res
  } else {
    // showToast({ title: "Something went wrong", body: res?.message })
    setLoader(false);
    return {
      ...res,
      code: "error"
    }
  }
}

export default InitWithAuth