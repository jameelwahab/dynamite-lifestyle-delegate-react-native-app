import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import { MyButton } from '../../components/MyButton'
import showToast from '../../functions/showToast'
import MyLoader from '../../components/MyLoader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CHNAGE_PASSWORD } from '../../DAL'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyInputs from '../../components/MyInputs'
import MyText from '../../components/MyText'
import { colors } from '../../utilities/colors'
import MyCheckBox from '../../components/MyCheckBox'
import routes from '../../navigation/routes'
import { encryptPassword } from '../../functions/encryptPassword'

const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswrod, setConfirmPasswrod] = useState("")
  const [loader, setLoader] = useState(false);
  const [logoutFrom, setLogoutFrom] = useState("other_devices")

  const btn_save = async () => {
    // if (oldPassword == "") {
    //   showToast({ body: "Please enter your old password" });
    // } else
    if (newPassword == "") {
      showToast({ body: "Please enter your new password" });
    } else if (confirmPasswrod != newPassword) {
      showToast({ body: "Passwords do not match" });
    } else {
      setLoader(true);
      let enc_Password = encryptPassword(newPassword);
      let body = {
        // old_password: oldPassword,
        password: enc_Password,
        confirm_password: enc_Password,
        logout_from: logoutFrom
      }
      let token = await AsyncStorage.getItem("@token")
      let res = await CHNAGE_PASSWORD({ body, token, navigation });
      setLoader(false);
      if (res.code == 200) {
        showToast({ title: "Password Changed", body: "Your password has been Changed Successfully!", type: "success" });
        if (logoutFrom == "all_devices") {
          await AsyncStorage.multiRemove(["token"]);
          navigation.reset({
            index: 0,
            routes: [{
              name: routes.login
            }]
          })
        } else {
          navigation.goBack()
        }
      }
    }
  }




  return (
    <RootView
      hideChatIcon
      hideProfile
      hideNotificaitonIcon
      title='Change Password' >
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
          <View style={{ flex: 1, marginTop: 10, marginHorizontal: 10 }}>
            {/* <MyInputs
              isPassword={true}
              label='Old Password*'
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            /> */}


            <MyInputs
              isPassword={true}
              label='New Password*'
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />


            <MyInputs
              isPassword={true}
              label='Confirm Password*'
              value={confirmPasswrod}
              onChangeText={(text) => setConfirmPasswrod(text)}
            />

            <View style={{ marginTop: 10, }}>
              <MyText color={colors.primary} type='medium' >For security reasons, would you like to:</MyText>

              <View style={{ marginTop: 15 }}>
                <MyCheckBox
                  circle
                  title='Logout from other devices'
                  value={logoutFrom == "other_devices"}
                  onPress={() => setLogoutFrom("other_devices")}
                />
                <View style={{ marginTop: 5 }}>
                  <MyCheckBox
                    circle
                    title='Logout from all devices'
                    value={logoutFrom == "all_devices"}
                    onPress={() => setLogoutFrom("all_devices")}
                  />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 15 }}>
              <MyButton
                onPress={btn_save}
                invert title='Save' />
            </View>

          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ChangePassword