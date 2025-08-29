import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import { colors } from '../../utilities/colors';
import { MyButton } from '../../components/MyButton';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { fonts } from '../../utilities/fonts';
import routes from '../../navigation/routes';
import AuthHeader from '../../components/AuthHeader';
import showToast from '../../functions/showToast';
import { VERIFY_OTP } from '../../DAL';
import MyLoader from '../../components/MyLoader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import utilities from '../../utilities';

const OPTscreen = ({ navigation, route }) => {
  const [code, setCode] = useState("")
  const [loader, setLoader] = useState(false);
  const codeInput = useRef()

  onResetPasswordScreen = async () => {
    if (code.length < 6) {
      showToast({ body: "Please enter your 6 digit code!" })
    } else {
      setLoader(true);
      let fd = new FormData();
      fd.append("email", route.params?.email);
      fd.append("verification_code", code);
      let res = await VERIFY_OTP({ body: fd });
      setLoader(false)
      if (res.code == 200) {
        navigation.navigate(routes.resetPassword, {
          email: route.params?.email
        })
      }
    }
  }

  return (
    <RootView hideHeader >
      <AuthHeader />
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{ marginHorizontal: 10, marginTop: "45%" }}>
            <MyText fontSize={28} type='medium'>Please check your email</MyText>
            <View style={{ marginTop: 5 }}>
              <MyText color={colors.lightText} >Enter PIN Code here.</MyText>
            </View>


            <View style={{}}>
              <View style={{ marginVertical: "10%", alignItems: "center" }}>

                <SmoothPinCodeInput
                  ref={codeInput}
                  value={code}
                  onTextChange={text => setCode(text)}
                  codeLength={6}
                  cellSize={(utilities.windowWidth() - 70) / 6}
                  // placeholder={"x"}
                  cellStyle={{
                    borderBottomWidth: 5,
                    borderColor: colors.lightText,
                    borderRadius: 5,
                    // justifyContent:"space-between"
                    backgroundColor: colors.secondary

                  }}
                  keyboardAppearance="dark"
                  cellStyleFocused={{
                    borderColor: colors.primary,
                  }}
                  textStyle={{
                    fontSize: 24,
                    color: colors.lightText
                  }}
                  inputProps={{
                    keyboardAppearance: "dark",
                    // autoFocus: true
                  }}
                // textStyleFocused={{
                //   color: 'crimson'
                // }}

                />
              </View>


              <MyButton title='Submit' onPress={onResetPasswordScreen} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default OPTscreen;
