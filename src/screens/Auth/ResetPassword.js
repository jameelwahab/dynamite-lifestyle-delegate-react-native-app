import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { colors } from '../../utilities/colors'
import MyInputs from '../../components/MyInputs'
import routes from '../../navigation/routes'
import { MyButton } from '../../components/MyButton'
import AuthHeader from '../../components/AuthHeader'
import MyLoader from '../../components/MyLoader'
import showToast from '../../functions/showToast'
import { RESET_PASSWORD } from '../../DAL'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ResetPassword = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onLoginScreen = async () => {
    if (newPassword == "") {
      showToast({ body: "Please enter your new password" });
    } else if (newPassword !== confirmPassword) {
      showToast({ body: "Passwords do not match" });
    } else {
      setLoader(true)
      let fd = new FormData();
      fd.append("email", route.params?.email);
      fd.append("password", newPassword);
      fd.append("confirm_password", confirmPassword);

      let res = await RESET_PASSWORD({ body: fd });
      setLoader(false)
      if (res.code == 200) {
        navigation.navigate(routes.login)
        showToast({ title: res?.message, type: 'success' })
      }
    }

  }
  return (
    <RootView hideHeader>
      <AuthHeader />
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{ marginHorizontal: 10, marginTop: "45%" }}>
            <MyText fontSize={28} type='medium'>Reset Password</MyText>

            <View style={{ marginTop: 30 }}>
              <MyInputs
                label='New Password*'
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                isPassword={true}
              />
            </View>
            <View>
              <MyInputs
                label='Confirm Password*'
                isPassword={true}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>


            <MyButton title='Update' onPress={onLoginScreen} />

          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ResetPassword