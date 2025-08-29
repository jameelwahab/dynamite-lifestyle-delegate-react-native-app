import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import RootView from '../../components/RootView';
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
import { socketUrl } from '../../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUserAndToken } from '../../redux/reducers/userSlice';
import { selectSettings, setSettings } from '../../redux/reducers/settingSlice';
import FastImage from 'react-native-fast-image';
import MyImage2 from '../../components/MyImage2';
import { setTimeZone } from '../../redux/reducers/timezoneSlice';
import { setNavbar } from '../../redux/reducers/navbarSlice';
import { setSocket } from '../../redux/reducers/socketSlice';
import { io } from 'socket.io-client';
import MyInputs from '../../components/MyInputs';
import messaging from '@react-native-firebase/messaging';
import InitWithAuth from '../../functions/InitWithAuth';
import { encryptPassword } from '../../functions/encryptPassword';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const { settings } = useSelector(selectSettings);
  const { S3_URL } = useSelector(selectUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const onForgotPasswordScreen = () => {
    navigation.navigate(routes.forgotPassword);
  };

  const onMainScreen = async () => {
    if (email.trim() == '') {
      showToast({ body: 'Please enter your email' });
    } else if (!isEmailValid(email.trim())) {
      showToast({ body: 'Please enter valid email' });
    } else if (password == '') {
      showToast({ body: 'Please enter password' });
    } else {
      setLoader(true);
      let fcm_token = '';
      try {
        fcm_token = await messaging().getToken();
      } catch (err) { }
      // let fd = new FormData();
      // fd.append('fcm_token', fcm_token);
      // fd.append('platform', 'app');
      // fd.append('login_by_device', Platform.OS);
      // fd.append('email', email.trim());
      // fd.append('password', encryptPassword(password));
      let obj = {
        fcm_token: fcm_token,
        platform: 'app',
        login_by_device: Platform.OS,
        email: email.trim(),
        password: encryptPassword(password),
      }
      let res = await LOGIN({ body: obj });
      if (res.code == 200) {
        if (res?.consultant_2fa_enabled) {
          navigation.navigate(routes.verifyAccount, {
            purpose: "login",
            timer: res?.expiresIn,
            apiBody: {
              ...obj,
              email: res?.tempData?.email,
              sessionId: res?.sessionId,
              action: res?.action,
              context: res?.context
            }
          });
        } else {
          let savedTOken = await AsyncStorage.setItem('@token', res?.token);
          let resp = await InitWithAuth(
            res?.token,
            navigation,
            setLoader,
            dispatch,
          );
          if (resp.code == 'error') {
            await AsyncStorage.removeItem('@token');
            showToast('Login Error', 'Please try again');
          }
        }
      }

      setLoader(false);
    }
  };

  return (
    <RootView hideHeader>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={__styles.view1}>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <MyText
              fontSize={20}
              style={{ textTransform: 'uppercase' }}
              type={'medium'}>
              Welcome To
            </MyText>
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
          <MyText color="#637381">Enter your details below.</MyText>

          <View style={{ marginTop: 20 }}>
            <MyInputs
              label="Email Address*"
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View>
            <MyInputs
              label="Password*"
              isPassword={true}
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <TouchableOpacity
            onPress={onForgotPasswordScreen}
            style={__styles.forgotBtn}>
            <MyText color={colors.primary} type="medium">
              Forgot Password?
            </MyText>
          </TouchableOpacity>

          <MyButton title="LOGIN" onPress={onMainScreen} />
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default Login;

const __styles = StyleSheet.create({
  view1: { marginTop: '15%', paddingHorizontal: 50, justifyContent: 'center' },
  view2: { marginTop: '12%', marginHorizontal: 20 },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: -10,
  },
});
