import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import UploadFileInput from '../../../components/UploadFileInput'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PORTAL_VIDEO_DETAIL, PORTAL_VIDEO_QUESTION_CONFIG, UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import showToast from '../../../functions/showToast'

const QuestionSettings = ({ route, navigation }) => {
  let { config, eventId, slug, videoId } = route.params;
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [data, updateData] = useState({
    showQuestion: false,
    btnText: !!config?.detail_event_button_text ? config?.detail_event_button_text : "",
    showThanksPage: true,
    desc: !!config?.lock_event_description ? config?.lock_event_description : "",
    thanksDesc: "",
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  useEffect(() => {
    getDataFromServer()
  }, [])

  const onSubmit = async () => {
    if (data.showThanksPage && data.thanksDesc.trim() == "") {
      showToast({ body: "Thank You Page Description is required", title: "Alert" });
      return;
    }

    setLoader(true);
    addDataToServer()
  }

  const addDataToServer = async () => {
    let quesOb = {
      show_question: data.showQuestion,
      button_text: data.btnText,
      is_show_thank_you_page: data.showThanksPage,
      questions_top_description: data.desc,
      thank_you_page_description: data.thanksDesc
    };

    let res = await PORTAL_VIDEO_QUESTION_CONFIG({
      token, navigation, eventSlug: slug, body: {
        module_type: "dynamite_event_video",
        question_configration: quesOb
      }, videoId: videoId
    })
    if (res.code == 200) {
      showToast({ title: "Updated successfully", type: "success" })
      navigation.goBack()
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const getDataFromServer = async () => {
    let res = await PORTAL_VIDEO_DETAIL({ token, navigation, videoId: videoId })
    if (res.code == 200) {

      let { question_configration: QuesConfig } = res?.dynamite_event_category_video;
      if (!!QuesConfig) {
        setData({
          showQuestion: QuesConfig?.show_question,
          btnText: !!QuesConfig?.button_text ? QuesConfig?.button_text : "",
          showThanksPage: QuesConfig.is_show_thank_you_page,
          desc: !!QuesConfig?.questions_top_description ? QuesConfig?.questions_top_description : "",
          thanksDesc: !!QuesConfig?.thank_you_page_description ? QuesConfig?.thank_you_page_description : "",
        })
      }
      setLoader(false);
      
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title='Question Configuration'>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={__styles.radioRootView}>
          <MyText isLabel>Show Question</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                onPress={() => setData({ showQuestion: true })}
                value={data?.showQuestion}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                onPress={() => setData({ showQuestion: false })}
                value={!data?.showQuestion}
              />
            </View>
          </View>
        </View>

        {data.showQuestion &&
          <>
            <MyInputs
              label='Button Text'
              value={data?.btnText}
              onChangeText={(text) => setData({ btnText: text })}
            />

            <View style={__styles.radioRootView}>
              <MyText isLabel>Show Thank You Page</MyText>
              <View style={__styles.radioView}>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='Yes'
                    onPress={() => setData({ showThanksPage: true })}
                    value={data?.showThanksPage}
                  />
                </View>
                <View style={__styles.radioItem}>
                  <MyCheckBox
                    title='No'
                    onPress={() => setData({ showThanksPage: false })}
                    value={!data?.showThanksPage}
                  />
                </View>
              </View>
            </View>
          </>}

        <Editor
          label='Question Top Description'
          height={150}
          initialValue={data?.desc}
          onChange={(text) => setData({ desc: text })}
        />
        {data.showQuestion && data.showThanksPage &&
          <Editor
            label='Thank You Page Description'
            height={150}
            initialValue={data?.thanksDesc}
            onChange={(text) => setData({ thanksDesc: text })}
          />}

        <MyButton title='Update' onPress={onSubmit} />

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default QuestionSettings


const __styles = StyleSheet.create({
  radioRootView: {

    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },

})