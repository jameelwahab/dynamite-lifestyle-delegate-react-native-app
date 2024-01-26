import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import { TextInput } from 'react-native-paper';
import MyText from '../../components/MyText';
import ScalableImage from 'react-native-scalable-image';
import { colors } from '../../utilities/colors';
import { fonts } from '../../utilities/fonts';
import { MyButton } from '../../components/MyButton';
import routes from '../../navigation/routes';
import showToast from '../../functions/showToast';
import { isEmailValid } from '../../functions/regex';
import { INIT_WITH_TOKEN, LOGIN } from '../../DAL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyLoader from '../../components/MyLoader';
import { S3_URL, socketUrl } from '../../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAndToken } from '../../redux/reducers/userSlice';
import { selectSettings, setSettings } from '../../redux/reducers/settingSlice';
import FastImage from 'react-native-fast-image';
import MyImage2 from '../../components/MyImage2';
import { setTimeZone } from '../../redux/reducers/timezoneSlice';
import { setNavbar } from '../../redux/reducers/navbarSlice';
import { drawerMenuList } from '../../navigation/SideBar/List';
import { setSocket } from '../../redux/reducers/socketSlice';
import { io } from 'socket.io-client';
import MyInputs from '../../components/MyInputs';




const Login = ({ navigation }) => {
  const dispatch = useDispatch()
  const { settings } = useSelector(selectSettings);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false)


  const onForgotPasswordScreen = () => {
    navigation.navigate(routes.forgotPassword);
  }

  const onMainScreen = async () => {
    if (email.trim() == "") {
      showToast({ body: "Please enter your email" });
    } else if (!isEmailValid(email.trim())) {
      showToast({ body: "Please enter valid email" });
    } else if (password == "") {
      showToast({ body: "Please enter password" });
    } else {
      setLoader(true);
      let fd = new FormData();
      fd.append("fcm_token", "")
      fd.append("platform", "app")
      fd.append("login_by_device", Platform.OS)
      fd.append("email", email.trim())
      fd.append("password", password)
      let res = await LOGIN({ body: fd });
      if (res.code == 200) {
        await with_Auth(res)
      }

      setLoader(false);

    }

  }

  const with_Auth = async (resp) => {
    let res = await INIT_WITH_TOKEN({ token: resp?.token });
    if (res.code == 200) {
      await AsyncStorage.setItem("@token", resp?.token);
      // let sideBarList = makeArrayOfSidebar(res?.nav_items, res?.consultant);
      dispatch(setSettings(res?.consultant_setting));
      dispatch(setUserAndToken({ user: res?.consultant, token: resp?.token }));
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
    } else {
      showToast({ title: "Something went wrong", body: res?.message })
      setLoader(false);
    }

  }


  const makeArrayOfSidebar = (list, user) => {
    let newArray = [];

    newArray.push({ ...drawerMenuList[0], title: "Mission Control" });
    drawerMenuList.forEach((item) => {

      let index = DELEGATE_NAV_ITEMS.findIndex(x => x.option_value == item.value)
      if (index > -1) {

        if (!item.collapsible) {
          if (item?.value == "chat" && !user?.is_chat_allow) {

          } else {
            newArray.push({ ...item, title: DELEGATE_NAV_ITEMS[index].option_label });
          }
        } else {

          let nestedArray = [];

          item?.nestedmenu.forEach((z) => {
            let nestedIndex = DELEGATE_NAV_ITEMS.findIndex(x => x.option_value == z.value);
            if (nestedIndex > -1) {
              nestedArray.push({ ...z, title: DELEGATE_NAV_ITEMS[nestedIndex].option_label });
            }
          })

          newArray.push({ ...item, title: DELEGATE_NAV_ITEMS[index].option_label, nestedmenu: nestedArray });

        }

      }
    });

    return newArray;

  }

  return (
    <RootView hideHeader>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
        <View style={__styles.view1}>
          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <MyText fontSize={20} style={{ textTransform: "uppercase" }} type={"medium"} >Welcome To</MyText>
          </View>
          {/* <ScalableImage
            width={Dimensions.get('screen').width - 100}
            source={{ uri: S3_URL + settings?.brand_logo }}
          /> */}
          <MyImage2
            uri={S3_URL + settings?.brand_logo}
            width={Dimensions.get('screen').width - 100}
          />


          {/* <FastImage
            source={{ uri: S3_URL + settings?.brand_logo }}
            style={{ width: Dimensions.get('screen').width - 100, aspectRatio:4.36 }}
            // onLoad={(res) => console.log("onLoadStart", res.nativeEvent?.width,)}
            // onLoadEnd={(res) => console.log("onLoadEnd", res.nativeEvent,)}
            // onProgress={e => console.log(e.nativeEvent.loaded / e.nativeEvent.total, "onProgress")}
          /> */}
        </View>
        <View style={__styles.view2}>
          <MyText color='#637381' >Enter your details below.</MyText>

          <View style={{ marginTop: 20 }}>
            <MyInputs
              label='Email Address*'
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}

            />
          </View>
          <View>
            <MyInputs
              label='Password*'
              isPassword={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <TouchableOpacity
            onPress={onForgotPasswordScreen}
            style={__styles.forgotBtn} >
            <MyText color={colors.primary} type='medium'>
              Forgot Password?
            </MyText>
          </TouchableOpacity>

          <MyButton title='LOGIN' onPress={onMainScreen} />
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Login;

const __styles = StyleSheet.create({
  view1: { marginTop: "15%", paddingHorizontal: 50, justifyContent: "center" },
  view2: { marginTop: "12%", marginHorizontal: 20 },
  forgotBtn: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: -10
  },
})


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