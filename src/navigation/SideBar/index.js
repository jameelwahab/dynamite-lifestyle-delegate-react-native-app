import { View, Text, Pressable, Image, StyleSheet, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { ChildComponents, ParentComponents, drawerMenuList } from './List';
import Collapsible from 'react-native-collapsible';
import { selectNavbar } from '../../redux/reducers/navbarSlice';
import { useSelector } from 'react-redux';
import { S3_URL } from '../../utilities/constants';
import { selectSettings } from '../../redux/reducers/settingSlice';
import MyImage2 from '../../components/MyImage2';
import ResponsiveImage2 from '../../components/ResponsiveImage2';
import utilities from '../../utilities';
import { selectSocket } from '../../redux/reducers/socketSlice';
import MyImage from '../../components/MyImage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const index = (props) => {
  const inset = useSafeAreaInsets();
  const { navigation, state } = props;
  const { navbar } = useSelector(selectNavbar);
  const { settings } = useSelector(selectSettings);
  const { socket } = useSelector(selectSocket);
  const [isCollapsed, setCollapsed] = useState([]);

  console.log(inset, "inset")



  useEffect(() => {
    socket.on("connect_error", () => {
      console.log("%c connect_error", 'background:#0000FF; color: #FFF', socket,)
      socket.connect();
    });


    socket.on("connect", () => {
      console.log("%c socket connected ", 'background:#A020F0; color: #FFF', socket)
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Remote Notification: ", remoteMessage)
      notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: { channelId: "default" }
      })
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      unsubscribe();
    }
  }, [])

  const toggleCollapse = (item) => {
    let index = isCollapsed.findIndex(x => x == item.value);
    if (index > -1) {
      isCollapsed.splice(index, 1);
    } else {
      isCollapsed.push(item.value);
    }
    setCollapsed([...isCollapsed])
  }

  const findCollapsed = (item) => {
    return isCollapsed.includes(item.value)
  }

  const changeSideBarScreen = async (screen) => {

    if (!!screen?.is_expanded) {
      toggleCollapse(screen)
    } else {
      navigation.closeDrawer()
      setTimeout(() => {
        console.log(navigation, state, "navigation")
        navigation.jumpTo(ParentComponents[screen.value].key)
      }, 200);
    }
  }

  const changeSideBarChildScreen = async (screen) => {


    navigation.closeDrawer()
    setTimeout(() => {
      console.log(navigation, state, "navigation")
      navigation.jumpTo(ChildComponents[screen.value].key)
    }, 200);

  }


  const optionView = (item, index, isCollaseable) => {
    let isSelected = ParentComponents[item.value].key == props.state.routeNames[props.state.index];

    return (
      <Pressable
        key={item.value}
        onPress={() => changeSideBarScreen(item)}
        style={[{ backgroundColor: isSelected && isCollaseable == false ? colors.lightPrimary3 : undefined, }, __styles.itemRootView]}>
        <MyImage
          source={{ uri: S3_URL + item?.icon }}
          style={__styles.itemIcon} />
        <View style={{ flex: 1, flexWrap: "wrap" }}>
          <MyText
            fontSize={14}
            color={isSelected && isCollaseable == false ? colors.primary : colors.text}
            style={{ marginLeft: 20 }} >{item.title}</MyText>
        </View>
        {isCollaseable &&
          <View style={{ paddingRight: 10 }}>
            {!findCollapsed(item) ? icons.upwardArrow() : icons.downwardArrow()}
          </View>}
      </Pressable>
    )
  }

  const nestedOptionView = (item, index, parentItem) => {
    if (!!ChildComponents[item.value]) {
      let isSelected = ChildComponents[item.value].key == props.state.routeNames[props.state.index]
      return (
        <Collapsible key={item.value} collapsed={findCollapsed(parentItem)}>
          <Pressable
            key={item.value}
            onPress={() => changeSideBarChildScreen(item)}
            style={[{ backgroundColor: isSelected ? colors.lightPrimary3 : undefined, }, __styles.itemRootView, __styles.nestedView]}>
            <MyImage source={{ uri: S3_URL + item?.icon }} style={__styles.itemIcon} />
            <View style={{ flex: 1, flexWrap: "wrap" }}>
              <MyText
                fontSize={14}
                color={isSelected ? colors.primary : colors.text}
                style={{ marginLeft: 20 }} >{item.title}</MyText>
            </View>
          </Pressable>
        </Collapsible>
      )
    } else return null;
  }


  return (
    <DrawerContentScrollView
      contentContainerStyle={{ paddingBottom: inset.bottom + 20 }}
      {...props}>
      {!!settings?.brand_logo &&
        <View style={__styles.logoView}>
          <ResponsiveImage2
            width={200}
            uri={S3_URL + settings?.brand_logo}
            style={__styles.logo} />
        </View>}

      {navbar.map((x, i) => {
        if (!!ParentComponents[x.value]) {
          let isCollaseable = Array.isArray(x.child_options) && x.child_options.length > 0;
          return (
            <View key={x.value}>
              {optionView(x, i, isCollaseable)}
              {isCollaseable && x?.child_options.map((y, j) => nestedOptionView(y, i, x))}
            </View >
          )
        }
      })}
    </DrawerContentScrollView >
  )
}

export default index;

const __styles = StyleSheet.create({
  logoView: {
    width: 200,
    alignSelf: "center", marginBottom: 10,
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
  }
})


