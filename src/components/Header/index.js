import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors } from '../../utilities/colors'
// import { backArrow, menu } from '../utilities/icons'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../../utilities/fonts'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { icons } from '../../utilities/icons'
import ProfileDropDown from './ProfileDropDown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { S3_URL } from '../../utilities/constants'
import MyImage from '../MyImage'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'



const Header = ({
  title = "",
  showBackButtonOnTop = false,
  hideChatIcon = false,
  hideNotificaitonIcon = false,
  hideHambugerMenu = false,
  hideBackBottomButton = false,
  titleView,
  hideProfile = false }) => {

  const { user, token } = useSelector(selectUser)
  const navigation = useNavigation()
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)


  onBackButtonPress = () => {
    navigation.goBack()
  }


  toggleSideMenu = () => {
    console.log(navigation, "navigation")
    navigation.toggleDrawer();
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
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", flexDirection: "row", paddingRight: 10 }}>


          {/* {!hideChatIcon &&
            <TouchableOpacity
              style={__header.RightButtonView}>
              <Ionicons name="chatbox-ellipses" color={colors.primary} size={17} />
            </TouchableOpacity>}

          {!hideNotificaitonIcon &&
            <TouchableOpacity
              style={__header.RightButtonView}>
              <Octicons name="bell-fill" color={colors.primary} size={17} />
            </TouchableOpacity>} */}


          {!hideProfile &&
            <TouchableOpacity onPress={() => setIsUserModalVisible(!isUserModalVisible)}>
              <MyImage source={
                !!user?.image?.thumbnail_1 ?
                  { uri: S3_URL + user?.image?.thumbnail_1 }
                  : icons.dummyUser}
                style={{ height: 35, width: 35 }}
                imageStyle={{ borderRadius: 35 / 2 }}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
      <View style={__header.secondView}>
        {!hideBackBottomButton &&
          <Pressable onPress={onBackButtonPress} style={__header.leftButtonView}>
            <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
          </Pressable>}
        {!!title ?
          <View style={__header.titleView}>
            <Text style={__header.titleText}>{title}</Text>
          </View>

          :
          <View style={{ flex: 1 }}>
            {titleView?.()}
          </View>
        }
      </View>
    </View>
  )
}

export default Header

const __header = StyleSheet.create({
  rootView: {
    height: 40,
    width: "100%",
    // backgroundColor: colors.darkSecondary,
    // backgroundColor: "dodgerblue",
    flexDirection: "row",
    alignItems: "center"
  },
  secondView: {
    height: 40,
    width: "100%",
    // backgroundColor: colors.darkSecondary,
    // backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center"
  },
  titleView: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 15
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
    justifyContent: "center"
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
})