import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyInputs from '../../components/MyInputs'
import { MyButton } from '../../components/MyButton'
import showToast from '../../functions/showToast'
import MyLoader from '../../components/MyLoader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CHNAGE_PASSWORD } from '../../DAL'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswrod, setConfirmPasswrod] = useState("")
  const [loader, setLoader] = useState(false);

  const btn_save = async () => {
    if (oldPassword == "") {
      showToast({ body: "Please enter your old password" });
    } else if (newPassword == "") {
      showToast({ body: "Please enter your new password" });
    } else if (confirmPasswrod != newPassword) {
      showToast({ body: "Passwords do not match" });
    } else {
      setLoader(true);
      let body = {
        old_password: oldPassword,
        password: newPassword,
        confirm_password: confirmPasswrod,
      }
      let token = await AsyncStorage.getItem("@token")
      let res = await CHNAGE_PASSWORD({ body, token, navigation });
      setLoader(false);
      if (res.code == 200) {
        showToast({ title: "Password Changed", body: "Your password has been Changed Successfully!", type: "success" });
        navigation.goBack()
      }
    }
  }




  return (
    <RootView
      hideChatIcon
      hideProfile
      title='Change Password' >
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
          <View style={{ flex: 1, marginTop: 30, marginHorizontal: 10 }}>
            <MyInputs
              isPassword={true}
              label='Old Password*'
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            />


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

            <MyButton
              onPress={btn_save}
              invert title='Save' />

          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default ChangePassword