import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from '../../components/MyLoader'
import { GET_TRAINING_LESSONS_RECORDING } from '../../DAL'
import ResponsiveImage2 from '../../components/ResponsiveImage2'
import WebPlayer from '../../components/WebPlayer'
import AudioPlayer from '../../components/AudioPlayer'
import MyWebview from '../../components/MyWebview'
import { S3_URL } from '../../utilities/constants'
import utilities from '../../utilities'
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import VimeoWithPip from '../../components/VimeoWithPip'

const TrainingLessonRecordings = ({ navigation, route }) => {
  let { slug } = route?.params;
  let { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [recording, setRecording] = useState(null)
  const [prevRecording, setPrevRecording] = useState(null);
  const [nextRecording, setNextRecording] = useState(null);
  const [recordingSlug, setSlug] = useState(!!slug ? slug : "")

  useEffect(() => {
    setLoader(true)
    getDataFromServer()
  }, [recordingSlug])

  const getDataFromServer = async () => {

    let res = await GET_TRAINING_LESSONS_RECORDING({ navigation, token, slug: recordingSlug });
    if (res.code == 200) {
      let next = Object.keys(res?.next_recording).length > 0;
      let prev = Object.keys(res?.previous_recording).length > 0;
      setRecording(res?.recording);
      setNextRecording(!!next ? res?.next_recording : null)
      setPrevRecording(!!prev ? res?.previous_recording : null)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const changeRecording = (slug) => {
    setRecording(null);
    setSlug(slug);
  }

  return (
    <RootView title={recording?.title} >
      <View style={{ flex: 1 }}>
        {!!recording &&
          <ScrollView>
            {!!recording?.video_url ?
              <>
                {recording?.video_url.includes("vimeo") ?
                  <VimeoWithPip url={recording?.video_url} focused={true} id={recording?._id} /> :
                  <WebPlayer width={utilities.screenWidth() - 20} url={recording?.video_url} />}
              </> :
              <ResponsiveImage2 uri={S3_URL + recording?.recording_image?.thumbnail_1} />}


            {(!!prevRecording || !!nextRecording) &&
              <View style={__styles.btnsRow}>
                {!!prevRecording ?
                  <TouchableOpacity
                    onPress={() => changeRecording(prevRecording?.recording_slug)}
                    style={__styles.btnsView}>
                    {icons.backwardArrow()}
                    <MyText style={__styles.btnsText}> Prevoius</MyText>
                  </TouchableOpacity> : <View />}

                {!!nextRecording ?
                  <TouchableOpacity
                    onPress={() => changeRecording(nextRecording?.recording_slug)}
                    style={__styles.btnsView}>
                    <MyText style={__styles.btnsText}>Next </MyText>
                    {icons.forwardArrow()}
                  </TouchableOpacity> : <View />}
              </View>}


            {!!recording?.audio_recording &&
              <AudioPlayer url={recording?.audio_recording} />}

            {!!recording?.short_description &&
              <View style={{ marginTop: 10 }}>
                <MyWebview
                  fullWidth
                  html={recording?.short_description}
                />
              </View>
            }
          </ScrollView>}
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingLessonRecordings

const __styles = StyleSheet.create({
  btnsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  btnsView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  btnsText: {
    color: colors.primary,
    fontSize: 16
  }
})