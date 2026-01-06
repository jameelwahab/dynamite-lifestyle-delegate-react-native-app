import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {colors} from '../../utilities/colors';
import {STRINGS} from '../../utilities/strings';
import {MyButton} from '../../components/MyButton';
import routes from '../../navigation/routes';
import showToast from '../../functions/showToast';
import {isEmailValid} from '../../functions/regex';
import {LOGIN} from '../../DAL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyLoader from '../../components/MyLoader';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import {selectSettings} from '../../redux/reducers/settingSlice';
import MyImage2 from '../../components/MyImage2';
import MyInputs from '../../components/MyInputs';
import messaging from '@react-native-firebase/messaging';
import InitWithAuth from '../../functions/InitWithAuth';
import {encryptPassword} from '../../functions/encryptPassword';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const {settings} = useSelector(selectSettings);
  const {S3_URL} = useSelector(selectUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const onForgotPasswordScreen = () => {
    navigation.navigate(routes.forgotPassword);
  };

  const onMainScreen = async () => {
    if (email.trim() == '') {
      showToast({body: STRINGS.LOGIN.enterEmail});
    } else if (!isEmailValid(email.trim())) {
      showToast({body: STRINGS.LOGIN.enterValidEmail});
    } else if (password == '') {
      showToast({body: STRINGS.LOGIN.enterPassword});
    } else {
      setLoader(true);
      let fcm_token = '';
      try {
        fcm_token = await messaging().getToken();
      } catch (err) {}
      let obj = {
        fcm_token: fcm_token,
        platform: 'app',
        login_by_device: Platform.OS,
        email: email.trim(),
        password: encryptPassword(password),
      };
      let res = await LOGIN({body: obj});
      if (res.code == 200) {
        if (res?.consultant_2fa_enabled) {
          navigation.navigate(routes.verifyAccount, {
            purpose: 'login',
            timer: res?.expiresIn,
            showLogo: true,
            apiBody: {
              ...obj,
              email: res?.tempData?.email,
              sessionId: res?.sessionId,
              action: res?.action,
              context: res?.context,
            },
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
            showToast(STRINGS.LOGIN.loginError, STRINGS.LOGIN.tryAgain);
          }
        }
      }

      setLoader(false);
    }
  };

  return (
    <RootView hideHeader>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.view1}>
          <View style={styles.welcomeContainer}>
            <MyText fontSize={20} style={styles.welcomeText} type={'medium'}>
              {STRINGS.LOGIN.welcomeTo}
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
        <View style={styles.view2}>
          <MyText color="#637381">{STRINGS.LOGIN.enterDetails}</MyText>

          <View style={styles.inputContainer}>
            <MyInputs
              label={STRINGS.LOGIN.emailLabel}
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View>
            <MyInputs
              label={STRINGS.LOGIN.passwordLabel}
              isPassword={true}
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <TouchableOpacity
            onPress={onForgotPasswordScreen}
            style={styles.forgotBtn}>
            <MyText color={colors.primary} type="medium">
              {STRINGS.LOGIN.forgotPassword}
            </MyText>
          </TouchableOpacity>

          <MyButton title={STRINGS.LOGIN.loginButton} onPress={onMainScreen} />
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default Login;

const styles = StyleSheet.create({
  view1: {
    marginTop: '15%',
    paddingHorizontal: 50,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    textTransform: 'uppercase',
  },
  view2: {
    marginTop: '12%',
    marginHorizontal: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: -10,
  },
});
