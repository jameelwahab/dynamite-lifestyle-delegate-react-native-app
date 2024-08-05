import { View, SafeAreaView, Pressable, StyleSheet, Image, TouchableHighlight, ActivityIndicator } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'

import { colors } from '../../utilities/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyText from '../MyText';
import MyCheckBox from '../MyCheckBox';
import { LOGOUT } from '../../DAL';
import { useDispatch, useSelector } from 'react-redux';
import { clearSocket, selectSocket } from '../../redux/reducers/socketSlice';
import { useNavigation } from '@react-navigation/native';
import { clearUserAndToken, selectUser } from '../../redux/reducers/userSlice';
import notifee from '@notifee/react-native'
import routes from '../../navigation/routes';

const ic_cross = require("../assets/cross.png")
const LogoutModal = forwardRef(({ closeProfileModal }, ref) => {
  const navigation = useNavigation();
  const { socket } = useSelector(selectSocket);
  const dispatch = useDispatch()
  const [isVisible, setVisiblity] = useState(false);
  const [logoutFrom, setLogoutFrom] = useState("this");
  const [loading, setLoading] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      openModal,
    }
  }, [])

  const openModal = () => {
    setVisiblity(true)
  }

  const closeScheduleTimeModal = () => {
    setVisiblity(false);
    setLoading(false)
  }

  const logoutAction = async () => {
    try {
      setLoading(true);
      let token = "";
      try {
        token = await AsyncStorage.getItem("@token");
        console.log(token, "token")
      } catch (err) {
        console.log(err, "error getting token")
      }
      let res = await LOGOUT({ token, navigation, type: logoutFrom == "all" ? "all_devices" : "this_device" });
      await AsyncStorage.multiRemove(["@token", "@user"])
    } catch (error) {
      console.log(error, "error removing asyncStorage")
    }
    closeProfileModal?.()
    closeScheduleTimeModal?.()

    socket.disconnect();
    dispatch(clearUserAndToken())
    dispatch(clearSocket())
    notifee.setBadgeCount(0);
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: routes.login }]
      })
    }, 500);

  }


  const modalSchedule = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeScheduleTimeModal}
        onBackButtonPress={closeScheduleTimeModal}
        useNativeDriverForBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={50}
        // avoidKeyboard={true}
        style={{ margin: 0, marginHorizontal: 5 }}>
        <View style={__style.rootView}>
          {/* <View style={{ flexDirection: "row" }}>
            <View style={__style.headingView}>
              <Pressable
                hitSlop={{ top: 10, left: 10, right: 10, left: 10 }}
                style={{ marginBottom: 10 }}
                onPress={closeScheduleTimeModal}>
                <Image source={ic_cross} style={{ height: 20, width: 20 }} />
              </Pressable>
            </View>
          </View> */}
          <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
            <MyText fontSize={16} color={colors.primary} type='M' >{"Are you sure you want to logout?"}</MyText>

            <View style={{ marginTop: 20 }} >
              <MyCheckBox
                isNormalText
                circle
                title={"Logout from this device"}
                value={logoutFrom == "this"}
                onPress={() => setLogoutFrom("this")}
              />

              <View style={{ marginTop: 5 }} >
                <MyCheckBox
                  circle
                  isNormalText
                  title={"Logout from all devices"}
                  value={logoutFrom == "all"}
                  onPress={() => setLogoutFrom("all")}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableHighlight
                onPress={closeScheduleTimeModal}
                underlayColor={colors.lightPrimary2}
                style={__style.transparntBtn} >
                <MyText color={colors.primary} >CANCEL</MyText>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={colors.lightPrimary2}
                onPress={logoutAction}
                disabled={loading}
                style={__style.transparntBtn}>
                {loading ?
                  <ActivityIndicator color={colors.golden} /> :
                  <MyText color={colors.primary} >AGREE</MyText>}
              </TouchableHighlight>

            </View>
          </View>
        </View>
      </Modal>)
  }


  return (
    <View>
      {modalSchedule()}
    </View>
  )
})

export default LogoutModal

const __style = StyleSheet.create({
  rootView: {
    // flex: 1,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    marginTop: "auto",
    marginBottom: "auto",
    paddingTop: 20,
    paddingTop: 20,
    paddingHorizontal: 10
  },
  transparntBtn: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 10
  },
  headingView: {
    flex: 1,
    alignItems: "flex-end"
  },
})