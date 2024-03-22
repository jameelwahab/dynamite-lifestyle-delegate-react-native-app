import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyInputs from '../../components/MyInputs'
import UploadFileInput from '../../components/UploadFileInput'
import Editor from '../../components/Editor'
import { MyButton } from '../../components/MyButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ADD_QUESTIONS, EDIT_QUESTIONS, PORTAL_ADD_EVENT, PORTAL_CATEGORY_ADD, PORTAL_CATEGORY_EDIT, PORTAL_UPDATE_EVENT, PORTAL_VIDEO_ADD, PORTAL_VIDEO_EDIT, UPLDATE_PORTAL_LOCK_EVENT, UPLOAD_FILE_TO_S3 } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import routes from '../../navigation/routes'
import { colors } from '../../utilities/colors'
import MyCheckBox from '../../components/MyCheckBox'
import showToast from '../../functions/showToast'
import UploadAudio from '../../components/UploadAudio'
import RootView from '../../components/RootView'
import AddQuestionComponent from './Components/AddQuestionComponent'

const AddEditQuestionScreen = ({ route, navigation }) => {
  let { module, moduleId, screenName, item } = route.params;

  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, updateData] = useState({
    statement: !!item?.question_statement ? item?.question_statement : "",
    placeholder: !!item?.question_placeholder ? item?.question_placeholder : "",
    type: !!item?.question_type ? item?.question_type : "mcq",
    status: !!item?.status == false ? false : true,
    documentAllowed: !!item?.status == true ? true : false,
    answerList: !!item?.options ? item?.options : [""],
    max: !!item?.scaling_max ? String(item?.scaling_max) : "",
    min: !!item?.scaling_min ? String(item?.scaling_min) : "",
    text: "",
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    if (data.statement.trim() == "") {
      showToast({ body: "Please enter question statement", title: "Alert" })
      return
    } else if (data.type == "scaling" && data.min.trim() == "") {
      showToast({ body: "Please enter minimum limit", title: "Alert" })
      return
    } else if (data.type == "scaling" && data.max.trim() == "") {
      showToast({ body: "Please enter maximum limit", title: "Alert" })
      return
    } else if (data.type == "mcq" || data.type == "checkbox") {
      if (data.answerList.some(x => x.trim() == "")) {
        showToast({ body: "Please enter all answer choices", title: "Alert" })
        return
      }
    }
    setLoader(true);
    let fd = new FormData();
    fd.append("question_statement", data.statement.trim());
    fd.append("question_placeholder", data.placeholder.trim());
    fd.append("status", data.status);
    fd.append("question_type", data.type);
    fd.append("is_document_allowed", data.documentAllowed);

    fd.append("created_for", module);
    fd.append("created_for_id", moduleId);

    if (data.type == "scaling") {
      fd.append("scaling_max", data.max);
      fd.append("scaling_min", data.min);
    } else if (data.type == "mcq" || data.type == "checkbox") {
      fd.append("options", JSON.stringify(data.answerList));
    }



    if (!!item) {
      updateDataToServer(fd)
    } else {
      addDataToServer(fd)
    }

  }

  const updateDataToServer = async (fd) => {
    let res = await EDIT_QUESTIONS({
      token, navigation, formdata: fd, questionId: item?._id
    })
    if (res.code == 200) {
      setLoader(false);
      showToast({ title: res?.message, type: "success", })
      navigation.navigate(screenName, { _id: moduleId })
    } else {
      setLoader(false);
    }
  }

  const addDataToServer = async (fd) => {
    let res = await ADD_QUESTIONS({
      token, navigation, formdata: fd,
    })
    if (res.code == 200) {
      setLoader(false);
      showToast({ title: res?.message, type: "success", })
      navigation.navigate(screenName, { _id: moduleId })
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title={!!item ? 'Edit Question' : 'Add Question'}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >


        <AddQuestionComponent
          data={data}
          setData={setData}
          onSubmit={onSubmit}
          btnText={!!item ? "Save Changes" : "SUBMIT"}
        />

      </KeyboardAwareScrollView>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default AddEditQuestionScreen

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

