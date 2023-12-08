import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyInputs from '../../components/MyInputs'
import { MyButton } from '../../components/MyButton'
import MyLoader from '../../components/MyLoader'
import { CHANGE_ZOOM_CRED } from '../../DAL'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setConsultant } from '../../redux/reducers/userSlice'
import showToast from '../../functions/showToast'

const ZoomSettings = ({ navigation }) => {
  const { token, user } = useSelector(selectUser);
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const [publicKey, setPublicKey] = useState(user?.zoom_api_key)
  const [secretKey, setSecretKey] = useState(user?.zoom_api_secret)
  const [accountId, setAccountId] = useState(user?.zoom_account_id)
  console.log(user, "user")
  const btn_submit = async () => {
    setLoader(true)
    let cred = {
      zoom_account_id: accountId.trim(),
      zoom_api_key: publicKey.trim(),
      zoom_api_secret: secretKey.trim(),
    }
    let res = await CHANGE_ZOOM_CRED({
      body: cred,
      navigation, token
    })
    setLoader(false)
    if (res.code == 200) {
      dispatch(setConsultant(res?.consultant_user))
      showToast({ title: "Updated successfully", type: "success" })
      navigation.goBack()
    }
  }


  return (
    <RootView
      hideChatIcon
      hideProfile
      title='Zoom Setting'>
      <View style={{ flex: 1, marginTop: 30, marginHorizontal: 10 }}>

        <MyInputs
          label='Zoom Api Public Key'
          value={publicKey}
          onChangeText={(text) => setPublicKey(text)}
        />

        <MyInputs
          label='Zoom Api Secret Key'
          value={secretKey}
          onChangeText={(text) => setSecretKey(text)}
        />

        <MyInputs
          label='Zoom Account Id'
          value={accountId}
          onChangeText={(text) => setAccountId(text)}
        />

        <View style={{ marginTop: 10 }}>
          <MyButton invert title='Submit' onPress={btn_submit} />
        </View>

        <MyLoader enable={loader} />
      </View>
    </RootView>
  )
}

export default ZoomSettings