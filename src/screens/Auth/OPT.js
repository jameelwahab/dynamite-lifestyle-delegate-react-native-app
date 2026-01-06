import {View, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {colors} from '../../utilities/colors';
import {MyButton} from '../../components/MyButton';
import routes from '../../navigation/routes';
import AuthHeader from '../../components/AuthHeader';
import showToast from '../../functions/showToast';
import {VERIFY_OTP} from '../../DAL';
import MyLoader from '../../components/MyLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import utilities from '../../utilities';
import {STRINGS} from '../../utilities/strings';

const OPTscreen = ({navigation, route}) => {
  const [code, setCode] = useState('');
  const [loader, setLoader] = useState(false);
  const codeInput = useRef();

  onResetPasswordScreen = async () => {
    if (code.length < 6) {
      showToast({body: STRINGS.OTP.enterCode});
    } else {
      setLoader(true);
      let fd = new FormData();
      fd.append('email', route.params?.email);
      fd.append('verification_code', code);
      let res = await VERIFY_OTP({body: fd});
      setLoader(false);
      if (res.code == 200) {
        navigation.navigate(routes.resetPassword, {
          email: route.params?.email,
        });
      }
    }
  };

  return (
    <RootView hideHeader>
      <AuthHeader />
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <MyText fontSize={28} type="medium">
              {STRINGS.OTP.title}
            </MyText>
            <View style={styles.descriptionWrapper}>
              <MyText color={colors.lightText}>
                {STRINGS.OTP.description}
              </MyText>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.pinCodeWrapper}>
                <SmoothPinCodeInput
                  ref={codeInput}
                  value={code}
                  onTextChange={text => setCode(text)}
                  codeLength={6}
                  cellSize={(utilities.windowWidth() - 70) / 6}
                  cellStyle={styles.pinCodeCell}
                  keyboardAppearance="dark"
                  cellStyleFocused={styles.pinCodeCellFocused}
                  textStyle={styles.pinCodeText}
                  inputProps={{
                    keyboardAppearance: 'dark',
                  }}
                />
              </View>

              <MyButton
                title={STRINGS.OTP.submitButton}
                onPress={onResetPasswordScreen}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 10,
    marginTop: '45%',
  },
  descriptionWrapper: {
    marginTop: 5,
  },
  formContainer: {},
  pinCodeWrapper: {
    marginVertical: '10%',
    alignItems: 'center',
  },
  pinCodeCell: {
    borderBottomWidth: 5,
    borderColor: colors.lightText,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  pinCodeCellFocused: {
    borderColor: colors.primary,
  },
  pinCodeText: {
    fontSize: 24,
    color: colors.lightText,
  },
});

export default OPTscreen;
