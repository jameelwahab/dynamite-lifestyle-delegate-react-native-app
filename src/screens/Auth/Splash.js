import { View, Text, Image, SafeAreaView, Alert, StatusBar, StyleSheet, Easing, Vibration } from 'react-native'
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
import InitWithAuth from '../../functions/InitWithAuth'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  delay,
  ReduceMotion,
} from 'react-native-reanimated';



const Splash = ({ navigation }) => {

  const dispatch = useDispatch()

  const translateY = useSharedValue(400); // Initial position off-screen
  const scale = useSharedValue(1); // Initial scale
  const showText = useSharedValue(false); // Show text flag
  const hideImg = useSharedValue(true); // Hide


  checkAuth = async () => {
    try {
      let token = await AsyncStorage.getItem("@token");
      console.log(token, "token")
      if (token != null) {
        // with_Auth(token);

        await InitWithAuth(token, navigation, () => { }, dispatch);


      } else {

        without_auth()
      }
    } catch (e) {
      without_auth()
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



  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });


  const textOpacity = useAnimatedStyle(() => {
    return {
      opacity: showText.value ? withTiming(1, { duration: 500 }) : 0,
    };
  });


  const imgOpacity = useAnimatedStyle(() => {
    return {
      opacity: hideImg.value ? 1 : withTiming(0, { duration: 500 }),
    };
  });

  useEffect(() => {
    SplashScreen.hide()


    // Animation sequence
    translateY.value = withSpring(-400, {
      duration:1500,
      dampingRatio: 3,
      stiffness: 1,
    });
    // scale.value = withTiming(1, { duration: 1000 });

    //  setTimeout(() => {
    //  }, 500);

    Vibration.vibrate([1000]);
    // After a delay, hide the logo and show the text
    setTimeout(() => {
    

      showText.value = true;
      hideImg.value = false;
      // translateY.value = withSpring(-400, { damping: 20, stiffness: 80 });
      scale.value = withTiming(10, { duration: 1000 });
    }, 1000); // Adjust the delay time as needed

    setTimeout(() => {
      checkAuth()
    }, 1000);
  }, [])

  return (

    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.darkSecondary }}>
      {/* <StatusBar backgroundColor={colors.secondary} barStyle={"light-content"} /> */}
      <Animated.View
        style={[{
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
        }, animatedStyle, imgOpacity]} >
        <Image source={icons.logo} style={{ height: 200, width: 200 }} />
      </Animated.View>
      <Animated.View style={[{ marginHorizontal: 40, alignItems: "center" }, textOpacity]}>
        <Image source={icons.missionControl} style={{ width: utilities.screenWidth() - 80, }}
          resizeMode="contain" />


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

      </Animated.View>

    </SafeAreaView>

  )
}

export default Splash

const __styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginTop: 20,
  },
})