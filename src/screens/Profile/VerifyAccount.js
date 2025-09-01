import { View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RootView from '../../components/RootView';
import TitleView from '../../components/TitleView';
import { Flex } from '../../UIComponents/FlexViews';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { MyButton } from '../../components/MyButton';
import utilities from '../../utilities';
import { colors } from '../../utilities/colors';
import MyText from '../../components/MyText';
import AuthHeader from '../../components/AuthHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setConsultant } from '../../redux/reducers/userSlice';
import moment from 'moment';
import { RESEND_OTP, VERIFY_CHANGE_PASSWORD, VERIFY_EDIT_PROFILE, VERIFY_LOGIN } from '../../DAL';
import MyLoader from '../../components/MyLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitWithAuth from '../../functions/InitWithAuth';
import showToast from '../../functions/showToast';
import routes from '../../navigation/routes';
import { setUserTimeZone } from '../../redux/reducers/timezoneSlice';
import MyImage2 from '../../components/MyImage2';
import { S3_URL } from '../../utilities/constants';
import { selectSettings } from '../../redux/reducers/settingSlice';

const VerifyAccount = ({ navigation, route }) => {
  const { token, user, S3_URL } = useSelector(selectUser);
  const { params } = route
  const timerSeconds = params?.timer || 30;
  const sessionId = useRef({ value: params?.apiBody?.sessionId || "" });
  const interval = useRef();
  const [code, setCode] = useState('');
  const [loader, setLoader] = useState(false);
  const [resendOTPLoader, setResendOTPLoader] = useState(false);
  const { settings } = useSelector(selectSettings);
  const [countDown, setCountDown] = useState(timerSeconds);
  const codeInput = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoader(false);
  }, []);

  const verifyLogin = async () => {
    setLoader(true)
    const res = await VERIFY_LOGIN({
      navigation, body: {
        ...params?.apiBody,
        otpCode: code,
        sessionId: sessionId?.current?.value
      }
    })
    if (res.code == 200) {
      let savedToken = await AsyncStorage.setItem('@token', res?.token);
      let resp = await InitWithAuth(
        res?.token,
        navigation,
        setLoader,
        dispatch,
      );
      if (resp.code == 'error') {
        await AsyncStorage.removeItem('@token');
        showToast({ title: 'Login Error', body: 'Please try again.', type: 'error' });
      }
    } else {
      setLoader(false)
      showToast({ title: 'Login Error', body: res?.message, type: 'error' });
    }
  }


  const verifyChangePassword = async () => {
    setLoader(true)
    const res = await VERIFY_CHANGE_PASSWORD({
      token,
      navigation, body: {
        ...params?.apiBody,
        consultantId: user?._id,
        email: user?.email,
        otpCode: code,
        sessionId: sessionId?.current?.value
      }
    })
    console.log(res, "res")
    if (res.code == 200) {
      showToast({ title: "Password Changed", body: "Your password has been Changed Successfully!", type: "success" });
      if (params?.apiBody?.logout_from == "all_devices") {
        await AsyncStorage.multiRemove(["token"]);
        navigation.reset({
          index: 0,
          routes: [{
            name: routes.login
          }]
        })
      } else {
        navigation.navigate(routes?.otherSettings)
      }
    } else {
      setLoader(false)
      showToast({ title: 'Error', body: res?.message, type: 'error' });
    }
  }

  const verifyEditProfile = async () => {
    setLoader(true)

    let fd = new FormData();
    fd.append("sessionId", sessionId?.current?.value)
    fd.append("otpCode", code)

    for (const [key, value] of Object.entries(params.apiBody.body)) {
      fd.append(key, value);
    }
    const res = await VERIFY_EDIT_PROFILE({
      token,
      navigation,
      body: fd
    })
    if (res.code == 200) {
      showToast({ type: 'success', title: res.message, });
      dispatch(setConsultant(res?.consultant));
      dispatch(setUserTimeZone(res?.consultant?.time_zone));
      showToast({ type: 'success', title: res.message, });
      navigation.navigate(params?.lastRouteName)
    } else {
      setLoader(false)
    }
  }

  const onSubmitPress = () => {
    if (code.length != 6) {
      showToast({ title: 'Please enter 6-digit code', type: 'error' });
    } else {
      if (params?.purpose == "login") {
        verifyLogin();
      } else if (params?.purpose == "change-password") {
        verifyChangePassword();
      } else if (params?.purpose == "edit-profile") {
        verifyEditProfile();
      }
    }
  };

  const resendOTP = async () => {
    setResendOTPLoader(true);
    let resp = await RESEND_OTP({
      body: {
        email: user?.email,
        consultantId: user?._id,
        context: params?.apiBody?.context,
        sessionId: sessionId?.current?.value
      },
      navigation: navigation,
      checkAuth: false
    });
    setResendOTPLoader(false);
    if (resp.code == 200) {
      if (resp?.sessionId) {
        sessionId.current.value = resp.sessionId;
      }
      setCountDown(timerSeconds);
      showToast({ title: "Code has been sent to your email", type: 'success' });
    } else {
      showToast({ title: 'Error', message: resp?.message, type: 'error' });
    }
  }



  useEffect(() => {
    codeInput.current?.focus();
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown == 0) {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [countDown]);



  const counter = () => {
    return (
      <View style={{ marginTop: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <MyText color={colors.lightText}>
            {"Didn't receive an email?"}
          </MyText>
          <TouchableOpacity
            onPress={resendOTP}
            disabled={countDown != 0 || loader}
            hitSlop={{ left: 10, bottom: 10, top: 10, right: 10 }}
            style={[{ marginTop: 5 }]}>
            {countDown != 0 ? (
              <MyText color={colors.lightText} style={{ letterSpacing: 0.5 }}>
                <MyText color={colors.lightText}>{'Resend Code in '}</MyText>
                <MyText type='bold' color={colors.primary} >{moment.utc(countDown * 1000).format("mm:ss")}</MyText>
              </MyText>
            ) : (
              <MyText color={colors.primary}> {'Resend Code'} </MyText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <RootView hideHeader>
      <Flex flex={1}>
        {/* <TitleView customStyle={{flex: undefined}} title="Verify Account" /> */}
        <AuthHeader />
        <Flex flex={1}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <View style={{ marginTop: 10 }}>

              {!!params?.showLogo && !!settings?.brand_logo && !!S3_URL &&
                <Flex alignItems="center">
                  <MyImage2
                    uri={S3_URL + settings?.brand_logo}
                    width={Dimensions.get('screen').width - 100}
                  />
                  <View style={{ height: 10 }} />
                </Flex>
              }




              <MyText align='center' fontSize={20} type="medium">
                Verify Your Account
              </MyText>
              <View style={{ marginTop: 5 }}>
                <MyText align='center' color={colors.lightText}>
                  {"Enter 6 digit code sent to your "}
                  <MyText color={colors.primary} >{params?.apiBody?.email || user?.email}</MyText>.
                </MyText>
              </View>

              <View style={{ marginTop: 5 }}>
                <MyText align='center' color={colors.lightText}>
                  Please check your inbox and enter the verification code below to confirm your email address.
                </MyText>
              </View>

              <View style={{}}>
                <View style={{ marginVertical: 40, alignItems: 'center' }}>
                  <SmoothPinCodeInput
                    ref={codeInput}
                    value={code}
                    onTextChange={text => setCode(text)}
                    codeLength={6}
                    cellSize={(utilities.windowWidth() - 45) / 6}
                    // placeholder={"x"}
                    cellStyle={{
                      borderBottomWidth: 3,
                      borderColor: colors.lightText,
                      borderRadius: 5,
                      // justifyContent:"space-between"
                      backgroundColor: colors.secondary,
                    }}

                    keyboardAppearance="dark"
                    cellStyleFocused={{
                      borderColor: colors.primary,
                    }}
                    textStyle={{
                      fontSize: 24,
                      color: colors.lightText2,
                    }}
                    inputProps={{
                      keyboardAppearance: 'dark',

                      // autoFocus: true
                    }}
                  // textStyleFocused={{
                  //   color: 'crimson'
                  // }}
                  />
                </View>

                <MyButton title="Submit" onPress={onSubmitPress} />

                {counter()}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Flex>
      </Flex>
      <MyLoader enable={resendOTPLoader || loader} />
    </RootView>
  );
};

export default VerifyAccount;
