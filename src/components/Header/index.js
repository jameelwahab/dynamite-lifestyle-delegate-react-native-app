import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity, Platform, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { colors } from '../../utilities/colors'
// import { backArrow, menu } from '../utilities/icons'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../../utilities/fonts'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { icons } from '../../utilities/icons'
import ProfileDropDown from './ProfileDropDown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MyImage from '../MyImage'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import routes from '../../navigation/routes'
import LogoutModal from './LogoutModal'



const Header = ({
  title = "",
  showBackButtonOnTop = false,
  hideChatIcon = false,
  hideNotificaitonIcon = false,
  hideHambugerMenu = false,
  hideBackBottomButton = false,
  titleView,
  hideProfile = false,
  customBackPress,
  hideSubHeader = false,
  hideUpperHeader = false,
  subTitle = ""
}) => {
  const { user, token, isChatAllowed, unreadCount, S3_URL } = useSelector(selectUser)
  
  const navigation = useNavigation()
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)


  onBackButtonPress = () => {
    if (!!customBackPress) {
      customBackPress()
    } else {
      navigation.goBack()
    }
  }


  toggleSideMenu = () => {
    navigation.toggleDrawer();
  }


  const navigateToChatScreen = () => {
    navigation.jumpTo(routes.chatNavigator)
  }
  const navigateToNotificationScreen = () => {
    navigation.navigate(routes.notificationList)
  }


  return (
    <View>
      <ProfileDropDown
        user={user}
        isVisible={isUserModalVisible}
        closeModal={() => setIsUserModalVisible(false)}
      />

      

      <View style={__header.rootView}>
        <View style={__header.leftButtonView}>
          {showBackButtonOnTop ?
            <Pressable onPress={onBackButtonPress} style={__header.leftButtonView}>
              <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
            </Pressable> :
            !hideHambugerMenu &&
            <Pressable onPress={toggleSideMenu} style={__header.leftButtonView}>
              {/* <Image source={menu} style={__header.leftButtonIcon} /> */}
              <Ionicons name="menu" color={colors.primary} size={25} />
              {/* <Image source={icons.threeLinesMenu} style={{height:30,width:30,tintColor:colors.primary,transform:[{rotateZ:"180deg"}]}} /> */}
            </Pressable>
          }
        </View>

        {/* <View style={{  height: 50,justifyContent:"center" }}>
          <Image
            source={require("../../assets/logo/mission-control-only.jpeg")}
            style={{ width: 180,resizeMode:"contain",}}
          />
        </View> */}
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", flexDirection: "row", paddingRight: 10 }}>

      

          {!hideChatIcon && isChatAllowed &&
            <TouchableOpacity
              onPress={() => navigateToChatScreen()}
              style={__header.RightButtonView}>
              <Ionicons name="chatbox-ellipses" color={colors.primary} size={17} />
            </TouchableOpacity>}

          {!hideNotificaitonIcon &&
            <TouchableOpacity
              onPress={() => navigateToNotificationScreen()}
              style={__header.RightButtonView}>
              {icons.notification(colors.primary, 17)}

              {unreadCount > 0 ?
                <View style={__header.badge}>
                  <Text style={__header.badgeText}> {unreadCount > 99 ? "+99" : unreadCount}</Text>
                </View> : null}
            </TouchableOpacity>}


          {/* 
          {!hideNotificaitonIcon &&
            <TouchableOpacity
              style={__header.RightButtonView}>
              <Octicons name="bell-fill" color={colors.primary} size={17} />
            </TouchableOpacity>} */}


          {!hideProfile &&
            <TouchableOpacity
              onPress={() => setIsUserModalVisible(!isUserModalVisible)}>
              <MyImage source={
                !!user?.image?.thumbnail_1 ?
                  { uri: S3_URL + user?.image?.thumbnail_1 }
                  : icons.dummyUser}
                style={{ height: 35, width: 35 }}
                imageStyle={{ borderRadius: 35 / 2, borderWidth: 1 / 2, borderColor: colors.white }}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
      {hideSubHeader == false &&
        <View style={__header.secondView}>
          {!hideBackBottomButton &&
            <Pressable onPress={onBackButtonPress} style={__header.leftButtonView}>
              <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
            </Pressable>}
          {!!title ?
            <View style={[__header.titleView, { paddingLeft: hideBackBottomButton ? 15 : 0 }]}>
              <Text style={__header.titleText}>{title}</Text>
              {!!subTitle && <Text style={__header.subTitle}>{subTitle}</Text>}
            </View>

            :
            <View style={{ flex: 1 }}>
              {titleView?.()}
            </View>
          }
        </View>
      }

    </View>
  )
}

export default Header

const __header = StyleSheet.create({
  rootView: {
    height: Platform.OS == "ios" ? 40 : 45,
    width: "100%",
    // backgroundColor: colors.darkSecondary,
    // backgroundColor: "dodgerblue",
    flexDirection: "row",
    alignItems: "center"
  },
  subTitle: {
    fontSize: 10,
    color: colors.lightText2,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    marginTop: 3
  },
  secondView: {
    height: 50,
    width: "100%",
    backgroundColor: colors.darkSecondary,
    // backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
			zIndex:1,
  },
  titleView: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    color: colors.primary,
    // fontFamily: fonts.semiBold,
    fontSize: 18,
    includeFontPadding: false,
    textTransform: "capitalize",
    fontFamily: fonts.bold,
    includeFontPadding: false
  },
  leftButtonView: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  leftButtonIcon: {
    width: 25,
    height: 25,
    tintColor: colors.primary
  },
  RightButtonView: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightPrimary2,
    borderRadius: 35 / 2,
    marginRight: 10
  },
  RightButtonIcon: {
    width: 30,
    height: 30,
    tintColor: colors.primary
  },
  badge: {
    height: 20,
    // width: 20,
    minWidth:20,
    paddingHorizontal:2,
    borderRadius: 20 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.delete,
    position: "absolute",
    top: -5,
    right: -5
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    color: colors.white
  }
})
