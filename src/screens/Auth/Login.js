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
import MyInputs from '../../components/MyInputs';
import FastImage from 'react-native-fast-image';
import MyImage2 from '../../components/MyImage2';
import { setTimeZone } from '../../redux/reducers/timezoneSlice';
import { setNavbar } from '../../redux/reducers/navbarSlice';
import { drawerMenuList } from '../../navigation/SideBar/List';
import { setSocket } from '../../redux/reducers/socketSlice';
import { io } from 'socket.io-client';




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
      let sideBarList = makeArrayOfSidebar(res?.nav_items, res?.consultant);
      dispatch(setSettings(res?.consultant_setting));
      dispatch(setUserAndToken({ user: res?.consultant, token: resp?.token }));
      dispatch(setNavbar(sideBarList));
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

      let index = list.findIndex(x => x.option_value == item.value)
      if (index > -1) {

        if (!item.collapsible) {
          if (item?.value == "chat" && !user?.is_chat_allow) {

          } else {
            newArray.push({ ...item, title: list[index].option_label });
          }
        } else {

          let nestedArray = [];

          item?.nestedmenu.forEach((z) => {
            let nestedIndex = list.findIndex(x => x.option_value == z.value);
            if (nestedIndex > -1) {
              nestedArray.push({ ...z, title: list[nestedIndex].option_label });
            }
          })

          newArray.push({ ...item, title: list[index].option_label, nestedmenu: nestedArray });

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