import { View, Text, Pressable, Image, StyleSheet, Platform, Dimensions, TextInput, Keyboard, SafeAreaView, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { ChildComponents, ParentComponents, } from './List';
import Collapsible from 'react-native-collapsible';
import { selectNavbar } from '../../redux/reducers/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { S3_URL } from '../../utilities/constants';
import { selectSettings } from '../../redux/reducers/settingSlice';
import MyImage2 from '../../components/MyImage2';
import ResponsiveImage2 from '../../components/ResponsiveImage2';
import utilities from '../../utilities';
import { selectSocket } from '../../redux/reducers/socketSlice';
import MyImage from '../../components/MyImage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidBadgeIconType, EventType } from '@notifee/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import notificationHandler from '../../functions/notificationHandler';
import { selectUser, setUnReadCount } from '../../redux/reducers/userSlice';
import RootView from '../../components/RootView';



let sub2 = null;
let sub3 = null;
let sub4 = null;
let sub5 = null;
const index = (props) => {
  const inset = useSafeAreaInsets();
  const { navigation, state } = props;
  const dispatch = useDispatch()
  const isDrawerOpen = useDrawerStatus() == "open";
  const { navbar } = useSelector(selectNavbar);
  const { user } = useSelector(selectUser);
  const { settings } = useSelector(selectSettings);
  const { socket } = useSelector(selectSocket);
  const [isCollapsed, setCollapsed] = useState([]);
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    if (!isDrawerOpen) {
      Keyboard.dismiss()
      setSearchText("")
    }
  }, [isDrawerOpen])

  const pushNotificationhandlers = async () => {
    sub2 = null;
    sub3 = null;
    sub4 = null;
    sub5 = null;
    let initialNotification = await notifee.getInitialNotification();

    if (!!initialNotification) {
      console.log('[initialNotification] notifee Notification caused application to open', initialNotification);
      if (Platform.OS == "ios") {
        console.log('[initialNotification] notifee Notification caused application to open', initialNotification);
        // setTimeout(() => {

        // }, 500);
        notificationHandler(initialNotification, navigation, navbar);
      }
    }


    sub2 = notifee.onForegroundEvent(({ type, detail }) => {
      console.log("onForegroundEvent", type, detail)
      switch (type) {
        case EventType.DISMISSED:
          console.log('notifee User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('[onForegroundEvent] notifee User Pressed notification', detail);
          notificationHandler(detail.notification, navigation, navbar);
          // this.notificationActions(detail)
          // notificationHandler(detail.notification, this.props.dispatch, setSideBarScreen, this.props.state, this.state.menu_visible)
          break;
      }
    });

    sub3 = notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("onBackgroundEvent", type, detail)
      switch (type) {
        case EventType.DISMISSED:
          console.log('notifee User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('[onBackgroundEvent] notifee User Pressed notification', detail);
          // this.notificationActions(detail)
          notificationHandler(detail.notification, navigation, navbar);
          break;
      }
    });

    sub4 = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('[onNotificationOpenedApp] Notification caused app to open from background state:', remoteMessage)
      if (remoteMessage) {
        if (Platform.OS == "android") {
          notificationHandler(remoteMessage, navigation, navbar);
        }
      }
    });


    messaging().getInitialNotification().then(remoteMessage => {
      console.log('Notification caused app to open from quit state:', remoteMessage);
      if (remoteMessage) {
        if (Platform.OS == "android") {
          notificationHandler(remoteMessage, navigation, navbar);
        }
      }
    });

  }

  useEffect(() => {
    pushNotificationhandlers()

    enableSocketEvents()
    socket.on("connect_error", () => {
      console.log("%c connect_error", 'background:#0000FF; color: #FFF', socket,)
      disbaleSocketEvents();
      socket.connect();
    });

    // socket.on("disconnect", () => {
    //   console.log("%c socket connected ", 'background:#A020F0; color: #FFF', socket)
    //   disbaleSocketEvents();
    // });

    socket.on("connect", () => {
      console.log("%c socket connected ", 'background:#A020F0; color: #FFF', socket)
      enableSocketEvents();
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Remote Notification: ", remoteMessage)
      notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId: "default",
          color: colors.secondary,
          smallIcon: "ic_notification"
        },
        data: remoteMessage?.data
      })
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      disbaleSocketEvents();
      unsubscribe();
      !!sub2 && sub2();
      !!sub3 && sub3();
      !!sub4 && sub4();
      // !!sub5 && sub5();
    }
  }, [])

  //! Socket Events 

  const enableSocketEvents = () => {
    socket.on("new_notification_receiver_for_delegate", (data) => handleSocketEvents(data, "new_notification_receiver_for_delegate"))
    socket.on("goal_stetement_event_reciever", (data) => handleSocketEvents(data, "goal_stetement_event_reciever"))
    socket.on("new_notification_receiver", (data) => handleSocketEvents(data, "new_notification_receiver"))
    socket.on("reminder_event_for_delegate", (data) => handleSocketEvents(data, "reminder_event_for_delegate"))
    socket.on("daily_dynamite_reminder_event", (data) => handleSocketEvents(data, "daily_dynamite_reminder_event"))
    socket.on("dynamite_streak_event", (data) => handleSocketEvents(data, "dynamite_streak_event"))
  }

  const disbaleSocketEvents = () => {
    socket.off("new_notification_receiver_for_delegate");
    socket.off("goal_stetement_event_reciever");
    socket.off("new_notification_receiver");
    socket.off("reminder_event_for_delegate");
    socket.off("daily_dynamite_reminder_event");
    socket.off("dynamite_streak_event");
  }

  const handleSocketEvents = (data, event) => {
    if (data?.action_response?.unread_notification_count != undefined) {
      if (typeof (data?.action_response?.unread_notification_count) == "number") {
        dispatch(setUnReadCount(data?.action_response?.unread_notification_count))
      } else if (Array.isArray(data?.action_response?.unread_notification_count)) {
        let count = data?.action_response?.unread_notification_count.find(x => x?._id == user?._id);
        if (count) {
          dispatch(setUnReadCount(count))
        }

      }
    } if (data?.data?.action_response?.unread_notification_count != undefined && typeof (data?.data?.action_response?.unread_notification_count) == "number") {
      dispatch(setUnReadCount(data?.data?.action_response?.unread_notification_count))
    } else if (data?.unread_notification_count != undefined && typeof (data?.unread_notification_count) == "number") {
      dispatch(setUnReadCount(data?.unread_notification_count))
    }
  }

  const toggleCollapse = (item) => {
    let index = isCollapsed.findIndex(x => x == item._id);
    if (index > -1) {
      isCollapsed.splice(index, 1);
    } else {
      isCollapsed.push(item._id);
    }
    setCollapsed([...isCollapsed])
  }

  const findCollapsed = (item) => {
    return isCollapsed.includes(item._id)
  }

  const changeSideBarScreen = async (screen) => {


    Keyboard.dismiss()
    navigation.closeDrawer()
    setTimeout(() => {
      navigation.jumpTo(ParentComponents[screen._id].key)
    }, 200);

  }

  const onOptionClick = async (screen, isCollpasable) => {
    console.log(screen, "screen")
    if (isCollpasable) {
      toggleCollapse(screen)
    } else {
      changeSideBarScreen(screen)
    }
  }

  const changeSideBarChildScreen = async (screen) => {

    Keyboard.dismiss()
    navigation.closeDrawer()
    setTimeout(() => {
      navigation.jumpTo(ChildComponents[screen._id].key)
    }, 200);

  }

  const searchableList = () => {
    if (searchText.trim().length == 0) {
      return navbar
    } else {
      let list = [];
      let searchableText = searchText.trim().toLowerCase();
      navbar.forEach((x, i) => {
        if (x.title.toLowerCase().includes(searchableText) || (!!x?.path && x?.path.toLowerCase().includes(searchableText))) {
          list.push(x);
        }

        if (Array.isArray(x?.child_options)) {
          let childList = [];
          x?.child_options.forEach((y) => {
            if (y.title.toLowerCase().includes(searchableText) || y?.path.toLowerCase().includes(searchableText)) {
              childList.push(y)
            }
          })
          if (childList.length > 0) {
            let index = list.findIndex(z => z._id == x._id);

            if (index > -1) {
              list.splice(index, 1, { ...list[index], child_options: childList, })
            } else {
              list.push({ ...x, child_options: childList, });
            }
          }
        }
      })
      return list
    }
  }


  const optionView = (item, index, isCollaseable, showDot) => {
    let isSelected = ParentComponents[item._id].key == props.state.routeNames[props.state.index];

    return (
      <Pressable
        key={item.value}
        onPress={() => onOptionClick(item, isCollaseable)}
        style={[{ backgroundColor: isSelected && isCollaseable == false ? colors.lightPrimary3 : undefined, }, __styles.itemRootView]}>
        <MyImage
          source={{ uri: S3_URL + item?.icon }}
          style={__styles.itemIcon} />
        <View style={{ flex: 1, }}>
          <MyText
            fontSize={14}
            color={isSelected && isCollaseable == false ? colors.primary : colors.text}
            style={{ marginLeft: 20 }} >{item.title}</MyText>
        </View>
        {isCollaseable &&
          <View style={{ paddingRight: 10 }}>
            {!findCollapsed(item) ? icons.upwardArrow() : icons.downwardArrow()}
          </View>}

        {showDot &&
          <View style={__styles.notifier} />}
      </Pressable>
    )
  }

  const nestedOptionView = (item, index, parentItem) => {
    if (!!ChildComponents[item._id]) {
      let isSelected = ChildComponents[item._id].key == props.state.routeNames[props.state.index]
      return (
        <Collapsible key={item.value} collapsed={findCollapsed(parentItem)}>
          <Pressable
            key={item.value}
            onPress={() => changeSideBarChildScreen(item)}
            style={[{ backgroundColor: isSelected ? colors.lightPrimary3 : undefined, }, __styles.itemRootView, __styles.nestedView]}>
            <MyImage source={{ uri: S3_URL + item?.icon }} style={__styles.itemIcon} />
            <View style={{ flex: 1, }}>
              <MyText
                fontSize={14}
                color={isSelected ? colors.primary : colors.text}
                style={{ marginLeft: 20, }} >{item.title}</MyText>
            </View>
          </Pressable>
        </Collapsible>
      )
    } else return null;
  }

  const { top, bottom, left, right } = inset;
  return (
    <View style={{ flex: 1, paddingLeft: left, paddingRight: right, paddingTop: top, paddingBottom: bottom, backgroundColor: colors.secondary }}>

      {!!settings?.brand_logo &&
        <View style={__styles.logoView}>
          <ResponsiveImage2
            width={200}
            uri={S3_URL + settings?.brand_logo}
            style={__styles.logo} />
        </View>}
      <View style={__styles.searchRoot}>
        <View>
          {icons.search(colors.placeholder, 20)}
        </View>
        <TextInput
          style={__styles.searchInput}
          placeholderTextColor={colors.placeholder}
          placeholder='Search...'
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          selectionColor={colors.selection}
          cursorColor={colors.white}
          keyboardAppearance="dark"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: inset.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
        {...props}>
        {searchableList().map((x, i) => {
          if (!!ParentComponents[x._id]) {
            let isCollaseable = Array.isArray(x.child_options);
            return (
              <View key={x.value}>
                {optionView(x, i, isCollaseable, user[showDotArray[x._id]])}
                {isCollaseable && x?.child_options.map((y, j) => nestedOptionView(y, i, x))}
              </View>)
          }
        })}
      </ScrollView >
    </View>
  )
}

export default index;

const __styles = StyleSheet.create({
  logoView: {
    width: 200,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: Platform.OS == "android" ? 10 : 0
  },

  itemRootView: {
    borderRadius: 10,
    marginHorizontal: 5,
    paddingLeft: 15,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    height: 25,
    width: 25,
  },
  nestedView: {
    paddingLeft: "12%"
  },
  searchRoot: {
    borderWidth: 1,
    borderColor: colors.border,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    height: "100%",
    color: colors.white
  },
  notifier: { marginRight: 10, height: 12, width: 12, backgroundColor: colors.primary2, borderRadius: 12 / 2, }
})

const showDotArray = {
  "internal-tickets": "is_internal_ticket_notify",
  "support_ticket": "is_sidebar_notify"
}

