import { View, Text, Image, SafeAreaView, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import SplashScreen from 'react-native-splash-screen'
import { icons } from '../../utilities/icons'
import MyLoader from '../../components/MyLoader'
import LottieView from 'lottie-react-native'
import utilities from '../../utilities'
import { colors } from '../../utilities/colors'
import { INIT_WITHOUT_TOKEN, INIT_WITH_TOKEN } from '../../DAL'
import { setSettings } from '../../redux/reducers/settingSlice'
import routes from '../../navigation/routes'
import { setUserAndToken } from '../../redux/reducers/userSlice'
import { setTimeZone } from '../../redux/reducers/timezoneSlice'
import { setNavbar } from '../../redux/reducers/navbarSlice'
import { drawerMenuList } from '../../navigation/SideBar/List'
import { setSocket } from '../../redux/reducers/socketSlice'
import { io } from 'socket.io-client'
import { socketUrl } from '../../utilities/constants'
import notifee from '@notifee/react-native';


const Splash = ({ navigation }) => {

  const dispatch = useDispatch()


  checkAuth = async () => {
    try {
      let token = await AsyncStorage.getItem("@token");
      if (token != null) {
        with_Auth(token);


      } else {

        without_auth()
      }
    } catch (e) {
      without_auth()
    }

  }

  const makeArrayOfSidebar = (list, user) => {
    DELEGATE_NAV_ITEMS.forEach(x => {
      console.log(x.option_label, x.option_value)
    })
    let newArray = [];
    let menuindex = 0;
    newArray.push({ ...drawerMenuList[0], title: "Mission Control", index: menuindex });
    drawerMenuList.forEach((item) => {

      let index = DELEGATE_NAV_ITEMS.findIndex(x => x.option_value == item.value)
      if (index > -1) {

        if (!item.collapsible) {

          if (item?.value == "chat" && !user?.is_chat_allow) {

          } else {
            menuindex++
            newArray.push({ ...item, title: DELEGATE_NAV_ITEMS[index].option_label, index: menuindex });
          }
        } else {

          let nestedArray = [];

          item?.nestedmenu.forEach((z) => {
            let nestedIndex = DELEGATE_NAV_ITEMS.findIndex(x => x.option_value == z.value);
            if (nestedIndex > -1) {
              menuindex++
              nestedArray.push({ ...z, title: DELEGATE_NAV_ITEMS[nestedIndex].option_label, index: menuindex });
            }
          })
          newArray.push({ ...item, title: DELEGATE_NAV_ITEMS[index].option_label, nestedmenu: nestedArray, });

        }

      }
    });


    return newArray;

  }

  const with_Auth = async (token) => {
    let res = await INIT_WITH_TOKEN({ token });
    if (res.code == 200) {

      // let sideBarList = makeArrayOfSidebar(res?.nav_items, res?.consultant);

      dispatch(setSettings(res?.consultant_setting));
      dispatch(setUserAndToken({ user: res?.consultant, token: token }));
      dispatch(setTimeZone({ user: res?.consultant?.time_zone, admin: res?.time_zone }));
      dispatch(setNavbar(res?.nav_items));
      console.log(socketUrl + "?user_id=" + res?.consultant?._id, "scoketUrl")
      dispatch(setSocket(io(socketUrl, {
        query: {
          user_id: res?.consultant?._id,
          role: "delegate"
        }
      })))

      moveTo(routes.mainScreen)
    } else if (res.code == 401) {
      try {
        await AsyncStorage.removeItem("@token");
      } catch (error) { }
      without_auth()
    } else {
      Alert.alert("Something went wrong",
        res?.message,
        [{ text: "Retry", onPress: checkAuth }])
    }

  }


  const without_auth = async () => {
    let res = await INIT_WITHOUT_TOKEN();
    if (res.code == 200) {
      dispatch(setSettings(res?.consultant_setting));
      moveTo(routes.login)
    } else {
      Alert.alert("Something went wrong",
        res?.message,
        [{ text: "Retry", onPress: checkAuth }])
    }

  }

  const moveTo = (screen) => {
    notifee.requestPermission()
    navigation.reset({
      index: 0,
      routes: [{ name: screen }]
    })
  }





  useEffect(() => {
    SplashScreen.hide()
    checkAuth()

  }, [])


  return (

    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.secondary }}>
      <StatusBar backgroundColor={colors.secondary} barStyle={"light-content"} />
      <Image source={icons.logo} style={{ height: 200, width: 200 }} />
      <View style={{ position: "absolute", top: (utilities.screenHeight() / 2) + 120 }}>
        <View style={{ height: 40, width: 40, backgroundColor: colors.lightPrimary3, borderRadius: 40 / 2 }}>
          <LottieView
            source={require("../../assets/animations/loader1.json")}
            style={{
              height: 40,
              width: 40,
            }}
            autoPlay
            loop
          />
        </View>
      </View>
    </SafeAreaView>

  )
}

export default Splash

const DELEGATE_NAV_ITEMS = [
  {
    option_label: "Mission Contral",
    option_value: "mission_control",
  },
  {
    option_label: "The Cosmos",
    option_value: "the_cosmos",
  },
  {
    option_label: "Members",
    option_value: "members",
  },
  {
    option_label: "Certification",
    option_value: "certification",
  },
  {
    option_label: "Assessments / Study",
    option_value: "assessment_study",
  },
  {
    option_label: "Member Goal Statement",
    option_value: "member_goal_statement",
  },
  {
    option_label: "Complete",
    option_value: "complete",
  },
  {
    option_label: "Incomplete",
    option_value: "incomplete",
  },
  {
    option_label: "Responded",
    option_value: "responded",
  },
  {
    option_label: "Delegate Pods",
    option_value: "delegate_pods",
  },
  {
    option_label: "Dynamite Pods",
    option_value: "dynamite_pods",
  },
  {
    option_label: "Delegate Events",
    option_value: "delegate_events",
  },
  {
    option_label: "Delegate Training",
    option_value: "delegate_training",
  },
  {
    option_label: "Your Recordings",
    option_value: "your_recordings",
  },
  {
    option_label: "Study Session",
    option_value: "study_session",
  },
  {
    option_label: "Your Vault",
    option_value: "your_vault",
  },
  {
    option_label: "Templates",
    option_value: "templates",
  },
  {
    option_label: "Links",
    option_value: "links",
  },
  {
    option_label: "Payments",
    option_value: "payments",
  },
  {
    option_label: "Payment Request",
    option_value: "payment_request",
  },
  {
    option_label: "Transactions",
    option_value: "transactions",
  },
  {
    option_label: "Commission Detail",
    option_value: "commission_detail",
  },
  {
    option_label: "Calendar",
    option_value: "calendar",
  },
  {
    option_label: "Groups",
    option_value: "groups",
  },
  {
    option_label: "Calendar Events",
    option_value: "calendar_events",
  },
  {
    option_label: "Support Ticket",
    option_value: "support_ticket",
  },
  {
    option_label: "Help",
    option_value: "support",
  },
  {
    option_label: "Contact Support",
    option_value: "contact_support",
  },
  {
    option_label: "Help Tech",
    option_value: "help_tech",
  },
  {
    option_label: "Digital Assets",
    option_value: "digital_assets",
  },
  {
    option_label: "90 Day Plan",
    option_value: "90_day_plan",
  },
  {
    option_label: "90 Day Tracker",
    option_value: "90_day_tracker",
  },
  {
    option_label: "Appointments",
    option_value: "appointment",
  },
  {
    option_label: "Appointments Configuration",
    option_value: "schedule_appointment",
  },
  {
    option_label: "Bookings",
    option_value: "bookings",
  },

  {
    option_label: "Attitude Assessment",
    option_value: "attitude_assessment",
  },
  {
    option_label: "Auto Responded Messages",
    option_value: "auto_responded_messages",
  },
  {
    option_label: "Sale Leads",
    option_value: "sale_leads",
  },
  {
    option_label: "Sections",
    option_value: "sections",
  },
  {
    option_label: "Leads",
    option_value: "leads",
  },
  {
    option_label: "Progress",
    option_value: "progress",
  },
  {
    option_label: "Nurture Members",
    option_value: "nurture_members",
  },
  {
    option_label: "Member Answers List",
    option_value: "member_answers_list",
  },
  {
    option_label: "Chat",
    option_value: "chat",
  },
  {
    option_label: "Portals",
    option_value: "portals",
  },
  {
    option_label: "My Portals",
    option_value: "my_portals",
  },
  {
    option_label: "The Source Feed",
    option_value: "the_source_feed",
  },
  {
    option_label: "All Source Feed",
    option_value: "all_source_feed",
  },
  {
    option_label: "Subscription List",
    option_value: "subscription_list",
  },
  {
    option_label: "All Member List",
    option_value: "all_member_list",
  },
  {
    option_label: "Self Image",
    option_value: "self_image",
  },

  {
    option_label: "Completed",
    option_value: "completed",
  },
  {
    option_label: "Incompleted",
    option_value: "incompleted",
  },
  {
    option_label: "Responded",
    option_value: "self_image_responded",
  },
  // {
  //   option_label: "Shop",
  //   option_value: "shop",
  // },
  {
    option_label: "Internal Tickets",
    option_value: "internal-tickets",
  },
  {
    option_label: "Welcome Reminder Settings",
    option_value: "welcome_reminder_settings",
  },
  {
    option_label: "Scheduled Feeds",
    option_value: "scheduled_feeds",
  },

  {
    option_label: "Whatsapp Chat",
    option_value: "whatsapp_chat",
  },
  {
    option_label: "Daily Dynamite Accountabalility Tracker",
    option_value: "daily_dynamite_accountabalility_tracker",
  },
  {
    option_label: "Daily Streak Performance",
    option_value: "daily_streak_performance",
  },
];