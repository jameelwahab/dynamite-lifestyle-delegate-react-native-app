import {View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../components/RootView';
import {Flex} from '../../UIComponents/FlexViews';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {MyButton} from '../../components/MyButton';
import utilities from '../../utilities';
import {colors} from '../../utilities/colors';
import MyText from '../../components/MyText';
import AuthHeader from '../../components/AuthHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, setConsultant} from '../../redux/reducers/userSlice';
import moment from 'moment';
import {
  RESEND_OTP,
  VERIFY_CHANGE_PASSWORD,
  VERIFY_EDIT_PROFILE,
  VERIFY_LOGIN,
} from '../../DAL';
import MyLoader from '../../components/MyLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitWithAuth from '../../functions/InitWithAuth';
import showToast from '../../functions/showToast';
import routes from '../../navigation/routes';
import {setUserTimeZone} from '../../redux/reducers/timezoneSlice';
import MyImage2 from '../../components/MyImage2';
import {selectSettings} from '../../redux/reducers/settingSlice';
import {STRINGS} from '../../utilities/strings';

const VerifyAccount = ({navigation, route}) => {
  const {token, user, S3_URL} = useSelector(selectUser);
  const {params} = route;
  const timerSeconds = params?.timer || 30;
  const sessionId = useRef({value: params?.apiBody?.sessionId || ''});
  const interval = useRef();
  const [code, setCode] = useState('');
  const [loader, setLoader] = useState(false);
  const [resendOTPLoader, setResendOTPLoader] = useState(false);
  const {settings} = useSelector(selectSettings);
  const [countDown, setCountDown] = useState(timerSeconds);
  const codeInput = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoader(false);
  }, []);

  const verifyLogin = async () => {
    setLoader(true);
    const res = await VERIFY_LOGIN({
      navigation,
      body: {
        ...params?.apiBody,
        otpCode: code,
        sessionId: sessionId?.current?.value,
      },
    });
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
        showToast({
          title: STRINGS.VERIFY_ACCOUNT.LOGIN_ERROR,
          body: STRINGS.VERIFY_ACCOUNT.PLEASE_TRY_AGAIN,
          type: 'error',
        });
      }
    } else {
      setLoader(false);
      showToast({
        title: STRINGS.VERIFY_ACCOUNT.LOGIN_ERROR,
        body: res?.message,
        type: 'error',
      });
    }
  };

  const verifyChangePassword = async () => {
    setLoader(true);
    const res = await VERIFY_CHANGE_PASSWORD({
      token,
      navigation,
      body: {
        ...params?.apiBody,
        consultantId: user?._id,
        email: user?.email,
        otpCode: code,
        sessionId: sessionId?.current?.value,
      },
    });
    console.log(res, 'res');
    if (res.code == 200) {
      showToast({
        title: STRINGS.VERIFY_ACCOUNT.PASSWORD_CHANGED,
        body: STRINGS.VERIFY_ACCOUNT.PASSWORD_CHANGED_SUCCESS,
        type: 'success',
      });
      if (params?.apiBody?.logout_from == 'all_devices') {
        await AsyncStorage.multiRemove(['token']);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: routes.login,
            },
          ],
        });
      } else {
        navigation.navigate(routes?.otherSettings);
      }
    } else {
      setLoader(false);
      showToast({
        title: STRINGS.VERIFY_ACCOUNT.ERROR,
        body: res?.message,
        type: 'error',
      });
    }
  };

  const verifyEditProfile = async () => {
    setLoader(true);

    let fd = new FormData();
    fd.append('sessionId', sessionId?.current?.value);
    fd.append('otpCode', code);

    for (const [key, value] of Object.entries(params.apiBody.body)) {
      fd.append(key, value);
    }
    const res = await VERIFY_EDIT_PROFILE({
      token,
      navigation,
      body: fd,
    });
    if (res.code == 200) {
      showToast({type: 'success', title: res.message});
      dispatch(setConsultant(res?.consultant));
      dispatch(setUserTimeZone(res?.consultant?.time_zone));
      showToast({type: 'success', title: res.message});
      navigation.navigate(params?.lastRouteName);
    } else {
      setLoader(false);
    }
  };

  const onSubmitPress = () => {
    if (code.length != 6) {
      showToast({
        title: STRINGS.VERIFY_ACCOUNT.ENTER_6_DIGIT_CODE,
        type: 'error',
      });
    } else {
      if (params?.purpose == 'login') {
        verifyLogin();
      } else if (params?.purpose == 'change-password') {
        verifyChangePassword();
      } else if (params?.purpose == 'edit-profile') {
        verifyEditProfile();
      }
    }
  };

  const resendOTP = async () => {
    setResendOTPLoader(true);
    let resp = await RESEND_OTP({
      body: {
        email: params?.apiBody?.email || user?.email,
        consultantId: user?._id,
        context: params?.apiBody?.context,
        sessionId: sessionId?.current?.value,
      },
      navigation: navigation,
      checkAuth: false,
    });
    setResendOTPLoader(false);
    if (resp.code == 200) {
      if (resp?.sessionId) {
        sessionId.current.value = resp.sessionId;
      }
      setCountDown(timerSeconds);
      showToast({title: STRINGS.VERIFY_ACCOUNT.CODE_SENT, type: 'success'});
    } else {
      showToast({
        title: STRINGS.VERIFY_ACCOUNT.ERROR,
        body: resp?.message,
        type: 'error',
      });
    }
  };

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
      <View style={styles.counterContainer}>
        <View style={styles.counterContent}>
          <MyText color={colors.lightText}>
            {STRINGS.VERIFY_ACCOUNT.DIDNT_RECEIVE_EMAIL}
          </MyText>
          <TouchableOpacity
            onPress={resendOTP}
            disabled={countDown != 0 || loader}
            hitSlop={{left: 10, bottom: 10, top: 10, right: 10}}
            style={styles.resendButton}>
            {countDown != 0 ? (
              <MyText color={colors.lightText} style={styles.countdownText}>
                <MyText color={colors.lightText}>
                  {STRINGS.VERIFY_ACCOUNT.RESEND_CODE_IN}
                </MyText>
                <MyText type="bold" color={colors.primary}>
                  {moment.utc(countDown * 1000).format('mm:ss')}
                </MyText>
              </MyText>
            ) : (
              <MyText color={colors.primary}>
                {' '}
                {STRINGS.VERIFY_ACCOUNT.RESEND_CODE}{' '}
              </MyText>
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
            <View style={styles.mainContainer}>
              {!!params?.showLogo && !!settings?.brand_logo && !!S3_URL && (
                <Flex alignItems="center">
                  <MyImage2
                    uri={S3_URL + settings?.brand_logo}
                    width={Dimensions.get('screen').width - 100}
                  />
                  <View style={styles.logoSpacer} />
                </Flex>
              )}

              <MyText align="center" fontSize={20} type="medium">
                {STRINGS.VERIFY_ACCOUNT.TITLE}
              </MyText>
              <View style={styles.marginTop5}>
                <MyText align="center" color={colors.lightText}>
                  {STRINGS.VERIFY_ACCOUNT.ENTER_CODE_SENT}
                  <MyText color={colors.primary}>
                    {params?.apiBody?.email || user?.email}
                  </MyText>
                  .
                </MyText>
              </View>

              <View style={styles.marginTop5}>
                <MyText align="center" color={colors.lightText}>
                  {STRINGS.VERIFY_ACCOUNT.CHECK_INBOX}
                </MyText>
              </View>

              <View style={styles.emptyView}>
                <View style={styles.pinCodeContainer}>
                  <SmoothPinCodeInput
                    ref={codeInput}
                    value={code}
                    onTextChange={text => setCode(text)}
                    codeLength={6}
                    cellSize={(utilities.windowWidth() - 45) / 6}
                    // placeholder={"x"}
                    cellStyle={[
                      styles.pinCodeCell,
                      {
                        borderColor: colors.lightText,
                        backgroundColor: colors.secondary,
                      },
                    ]}
                    keyboardAppearance="dark"
                    cellStyleFocused={[
                      styles.pinCodeCellFocused,
                      {borderColor: colors.primary},
                    ]}
                    textStyle={[styles.pinCodeText, {color: colors.lightText2}]}
                    inputProps={{
                      keyboardAppearance: 'dark',

                      // autoFocus: true
                    }}
                    // textStyleFocused={{
                    //   color: 'crimson'
                    // }}
                  />
                </View>

                <MyButton
                  title={STRINGS.VERIFY_ACCOUNT.SUBMIT}
                  onPress={onSubmitPress}
                />

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

const styles = StyleSheet.create({
  counterContainer: {
    marginTop: 40,
  },
  counterContent: {
    alignItems: 'center',
  },
  resendButton: {
    marginTop: 5,
  },
  countdownText: {
    letterSpacing: 0.5,
  },
  mainContainer: {
    marginTop: 10,
  },
  logoSpacer: {
    height: 10,
  },
  marginTop5: {
    marginTop: 5,
  },
  emptyView: {},
  pinCodeContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  pinCodeCell: {
    borderBottomWidth: 3,
    borderRadius: 5,
  },
  pinCodeCellFocused: {},
  pinCodeText: {
    fontSize: 24,
  },
});

export default VerifyAccount;
