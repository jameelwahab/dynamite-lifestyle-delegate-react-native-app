import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyInputs from '../../components/MyInputs'
import { MyButton } from '../../components/MyButton'
import { colors } from '../../utilities/colors'
import routes from '../../navigation/routes'
import AuthHeader from '../../components/AuthHeader'
import MyLoader from '../../components/MyLoader'
import { isEmailValid, validateEmail } from '../../functions/regex'
import showToast from '../../functions/showToast'
import { SEND_OTP } from '../../DAL'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ForgotPassword = ({ navigation }) => {

  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");


  onOPTScreen = async () => {
    if (email.trim() == "") {
      showToast({ body: "Please enter your email address!" })
    }
    else if (!isEmailValid(email)) {
      showToast({ body: "Please enter valid email address!" })
    } else {
      setLoader(true)
      let fd = new FormData();
      fd.append("email", email);
      let res = await SEND_OTP({ body: fd })
      setLoader(false)
      if (res.code == 200) {
        navigation.navigate(routes.optScreen, {
          email: email
        });
      }
    }
  }


  return (
    <RootView hideHeader>
      <AuthHeader />
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{ marginHorizontal: 10, marginTop: "45%" }}>
            <MyText fontSize={28} type='medium'>Forget Password</MyText>
            <View style={{ marginTop: 0, }}>

              <View style={{ marginVertical: 20, }}>
                <MyInputs
                  label='Email Address*'
                  value={email}
                  keyboardType='email-address'
                  onChangeText={(text) => setEmail(text)}
                  
                />
              </View>

              <MyButton title='Submit' onPress={onOPTScreen} />

            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ForgotPassword