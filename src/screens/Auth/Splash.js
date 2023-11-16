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

  const with_Auth = async (token) => {
    let res = await INIT_WITH_TOKEN({ token });
    if (res.code == 200) {
      dispatch(setSettings(res?.consultant_setting));
      dispatch(setUserAndToken({ user: res?.consultant, token: token }));
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