import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import UploadFileInput from '../../../components/UploadFileInput'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'

const LockEventSettings = ({ route, navigation }) => {
  let { config, slug } = route.params;
  console.log(config, 'config')
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, updateData] = useState({
    lockBtnText: !!config?.lock_event_button_text ? config?.lock_event_button_text : "",
    btnText: !!config?.detail_event_button_text ? config?.detail_event_button_text : "",
    link: !!config?.lock_event_button_link ? config?.lock_event_button_link : "",
    lockIcon: !!config?.lock_event_logo ? config?.lock_event_logo : "",
    desc: !!config?.lock_event_description ? config?.lock_event_description : ""
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    setLoader(true);
    if (!!data?.lockIcon?.uri) {
      let fd = new FormData();
      fd.append("image", data?.lockIcon);
      fd.append("width", data?.lockIcon?.width);
      let res = await UPLOAD_FILE_TO_S3({
        token, navigation, body: fd
      });
      if (res.code == 200) {
        addDataToServer(res?.image_path)
      } else {
        setLoader(false);
      }
    } else {
      addDataToServer()
    }
  }

  const addDataToServer = async (newImagePath) => {
    let res = await UPLDATE_PORTAL_LOCK_EVENT({
      token, navigation, eventSlug: slug, body: {
        detail_event_button_text: data?.btnText.trim(),
        lock_event_button_link: data?.link,
        lock_event_button_text: data?.lockBtnText.trim(),
        lock_event_description: data?.desc.trim(),
        lock_event_logo: !!newImagePath ? newImagePath : data?.lockIcon
      }
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalListScreen)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title='Lock Event Content'>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
      >
        <MyInputs
          label='Lock Button Text'
          value={data?.lockBtnText}
          onChangeText={(text) => setData({ lockBtnText: text })}
        />

        <MyInputs
          label='Button Text'
          value={data?.btnText}
          onChangeText={(text) => setData({ btnText: text })}
        />

        <MyInputs
          label='Button Link'
          value={data?.link}
          onChangeText={(text) => setData({ link: text })}
        />

        <UploadFileInput
          label='Lock Event Icon'
          subLabel='(Recommended Size 1000 X 250)'
          onImagePicked={(img) => setData({ lockIcon: img })}
          onRemoveBtnPress={() => setData({ lockIcon: "" })}
          selectedImage={data?.lockIcon}
        />

        <Editor
          label='Lock Event Description'
          height={150}
          initialValue={data?.desc}
          onChange={(text) => setData({ desc: text })}
        />

        <MyButton title='Update' onPress={onSubmit} />

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default LockEventSettings