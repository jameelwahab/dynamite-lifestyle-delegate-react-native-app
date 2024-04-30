import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import { colors } from '../../../utilities/colors'
import Editor from '../../../components/Editor'
import MyLoader from '../../../components/MyLoader'
import { MyButton } from '../../../components/MyButton'
import { icons } from '../../../utilities/icons'
import showToast from '../../../functions/showToast'
import { ADD_NOTES, EDIT_NOTES, QUESTION_ADD_REPLY } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyText from '../../../components/MyText'
import Header from '../../../components/Header'
import UploadAudio from '../../../components/UploadAudio'
import { QUESTIONS_ADD_DYNAMIYE_REPLY, QUESTIONS_DELETE_DYNAMIYE_REPLY } from '../../../DAL/Questions'
import { not } from 'react-native-reanimated'
const AddReply = ({ navigation, route }) => {

  const { token } = useSelector(selectUser)
  const [note, setNote] = useState("");
  const [loader, setLoader] = useState(false);
  const [audio, setAudio] = useState(null)


  const btn_save = () => {

    setLoader(true);
    addTheNote();

  }

  const addTheNote = async () => {
    let fd = new FormData();
    fd.append("message", note.trim());
    fd.append("created_for", "self_image");
    if (!!audio?.uri) {
      fd.append("audio_file", audio);
    }

    let res = await QUESTIONS_ADD_DYNAMIYE_REPLY({
      token, navigation, formData: fd
    });

    setLoader(false)
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" });
      route?.params?.refresh?.();
      navigation.goBack()
    }
  }


  return (
    <RootView hideHeader>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={__styles.closeBtnView}>
          {icons.back(colors.primary, 25)}
        </TouchableOpacity>
        <MyText fontSize={18} color={colors.primary} type='bold'> {"Add Reply"} </MyText>
      </View>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>

          <View>



            <View style={{ flex: 1, marginTop: 15 }}>
              <Editor
                initialValue={note}
                height={150}
                onChange={(text) => setNote(text)}
              />

              <View style={{ marginTop: 10 }}>
                <UploadAudio
                  label='Upload Audio'
                  subLabel='Audio mp3 (max 200mb)'
                  onRemoveBtnPress={() => setAudio(null)}
                  onAudioPicked={(mp3) => setAudio(mp3)}
                  selectedAudio={audio}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>

                {/* <MyButton
                  onPress={() => navigation.goBack()}
                  invert
                  title='Cancel'
                  style={{ paddingHorizontal: 10, marginRight: 10 }} /> */}

                <MyButton
                  invert
                  title={'Submit'}
                  onPress={btn_save}
                  style={{ paddingHorizontal: 10, }} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <MyLoader enable={loader} />
      </View>
    </RootView>
  )
}

export default AddReply;

const __styles = StyleSheet.create({
  headerView: {
    flexDirection: "row"
  },
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  }
})