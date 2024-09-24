import { View, Text, TouchableHighlight, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Pressable, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../../utilities/colors'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../../utilities/icons'
import Modal from 'react-native-modal'
import MyText from '../../../components/MyText'
import { TransparentButton } from '../../../components/MyButton'
import showToast from '../../../functions/showToast'
import Toast from 'react-native-toast-message'
import MyImage from '../../../components/MyImage'
import ImageUploadModal from '../../../components/ImageUploadModal'
import ImageZoomer from '../../../components/ImageZoomer'
import { fonts } from '../../../utilities/fonts'
import { useSelector } from 'react-redux'
import { selectSocket } from '../../../redux/reducers/socketSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { EDIT_SCHEDULE_BROADCAST_MESSAGE, SEND_BROADCAST_MESSAGE, UPLOAD_FILE_FOR_CHAT } from '../../../DAL'
import { S3_URL, appName, dateTimeFormat } from '../../../utilities/constants'
import { ProgressBar } from 'react-native-paper'
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  OOutputFormatAndroidType,
  AudioSourceAndroidType,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import ReactNativeBlobUtil from 'react-native-blob-util'
import moment from 'moment'
import { PERMISSIONS, request, requestMultiple } from 'react-native-permissions'
import { SimpleLoader } from '../../../components/MyLoader'
import { isUrl } from '../../../functions/regex'
import MyInputs from '../../../components/MyInputs'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import CalendarModal from '../../../components/CalendarModal'
import TimePicker from '../../../components/TimePicker'
let selection;

const SendMsgView = ({ receiver, navigation, edit, clearEdit, chatId, setChat }) => {
  const { socket } = useSelector(selectSocket);
  const { user, token } = useSelector(selectUser);
  const ref_timePicker = useRef()
  const ref_calendar = useRef()
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isEditorVisible, setEditorVisiblity] = useState(true);
  const [imageZommer, setImageZommer] = useState("")
  const [recorderTime, setRecorderTime] = useState({
    recordTimeInMillis: 0,
    recordTime: "00:00",
  });
  const [fileLoader, setFileLoader] = useState(false)
  const [isImageModalShown, setImageModalVisiblity] = useState(false);
  const [linkModal, setLinkModal] = useState({ isVisible: false, link: "", title: "" });
  const [isRecording, setRecording] = useState(false);
  const [msg, updateMsg] = useState({
    image: "",
    text: "",
    audio: "",
    audioTime: ""
  });
  const [recordedAudio, setRecordedAudio] = useState(null)
  const [broadcastType, setBroadcastType] = useState({
    isVisible: false,
    type: 1,
    scheduleDate: moment(),
    scheduleTime: "00:00",
    addAsNote: false
  })

  const [sendMsgLoader, setSendMsgLoader] = useState(false);

  const setMsg = (updation) => updateMsg({ ...msg, ...updation })

  useEffect(() => {
    console.log(edit, "edit")
    if (!!edit?._id) {
      setMsg({
        image: !!edit?.image ? edit?.image : "",
        text: !!edit?.message ? edit?.message : "",
        audio: !!edit?.audio ? edit?.audio : "",
        audioTime: !!edit?.audio_duration ? edit?.audio_duration : "",
      });
      if (edit?.message_type == "schedule") {
        setBroadcastType({
          ...broadcastType,
          type: 2,
          scheduleDate: moment.utc(edit?.schedule_date_time),
          scheduleTime:  moment.utc(edit?.schedule_date_time),
          addAsNote: edit?.add_as_personal_note
        })
      }
    }
  }, [edit])

  useEffect(() => {
    selection = null;

    return () => {
      try {
        stopReorder()
      } catch (e) {
        console.log(e, "error")
      }
    }
  }, [])

  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        let grants;
        if (Platform.Version >= 33) {
          grants = await requestMultiple([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
          ]);
        } else {
          grants = await requestMultiple([
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
          ]);
        }

        if (Object.values(grants).every(x => x == 'granted')) {
          return true;
        } else {
          Alert.alert("Permission Denied")
          return false
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      let granted = await request(PERMISSIONS.IOS.MICROPHONE);
      console.log(granted, "granted")
      if (granted == 'granted') {
        return true
      } else {
        return false
      }

    }
  }

  const recordBtn = async () => {
    let res = await getPermissions();
    if (res) {
      setRecording(true)
      startRecording()
    } else {
      showToast({ body: `Please allow mircophone permission from app settings`, title: "Microphone permission denied" })
    }
  }

  const startRecording = async () => {

    try {
      const generateAudioName = () => {
        if (Platform.OS == "android")
          return ReactNativeBlobUtil.fs.dirs.CacheDir + "/" + moment().valueOf();
        else return moment().valueOf();
      };

      const path = `${generateAudioName()}.aac`;
      // Set up the audio settings for our recording adventure
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      const meteringEnabled = false;


      const uri = await audioRecorderPlayer?.startRecorder(
        path,
        audioSet,
        meteringEnabled,
      );


      audioRecorderPlayer.addRecordBackListener((e) => {
        // console.log(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)), "audioRecorderPlayer")

        if (e.currentPosition >= 300000) {
          audioRecorderPlayer.pauseRecorder()
        }
        if (recorderTime.recordTime != moment.utc(e.currentPosition).format('mm:ss')) {
          setRecorderTime({
            recordTimeInMillis: e.currentPosition,
            recordTime: moment.utc(e.currentPosition).format('mm:ss'),
          });
        }
      });






    } catch (error) {
      console.log('Uh-oh! Failed to start recording:', error);
      showToast({ body: error.message, title: "Error" })
      setRecording(false)
    }
  };

  const stopReorder = async () => {
    try {
      let miliis = recorderTime.recordTimeInMillis;
      setRecorderTime({ recordTime: "00:00", recordTimeInMillis: 0, });
      setRecording(false)
      audioRecorderPlayer?.removeRecordBackListener();
      const result = await audioRecorderPlayer?.stopRecorder();
      return {
        uri: result,
        time: miliis
      };
    } catch (e) {
      console.log(e, "erro on stop")
    }
  }

  const sendAudioMsg = async () => {
    let audio = await stopReorder();
    let audioObj = {
      audio: {
        uri: audio.uri,
        name: audio.uri.split("/").pop(),
        type: "audio/aac"
      },
      audioTime: audio.time
    }
    setRecordedAudio(audioObj)
    sendMsgButton(audioObj)
  }


  const uplaodFileOnS3 = async (file, type) => {
    setFileLoader(true);
    let formData = new FormData();
    formData.append("image", file);
    let resp = await UPLOAD_FILE_FOR_CHAT({ token, navigation, file: formData });
    if (resp.code == 200) {
      setFileLoader(false);
      return resp
    }

  }

  const sendMsgButton = async (audioObj) => {
    if (msg.text.trim() == "" && !!msg?.image == false && !!audioObj == false) {
      showToast({ title: "Please write something", type: "info" })
    } else {
      setBroadcastType({ ...broadcastType, isVisible: true });
    }
  }

  const sendMessage = async () => {
    setSendMsgLoader(true);
    let imagePath = msg.image;
    let audioPath = '';
    if (!!msg.image?.uri) {

      imagePath = await uplaodFileOnS3(msg.image, 'image').then((res) => res.image_path);
      if (!!imagePath == false) {
        setSendMsgLoader(false);
        return
      }
    } else if (!!recordedAudio?.audio) {
      audioPath = await uplaodFileOnS3(recordedAudio.audio, 'audio').then((res) => res.image_path);
      if (!!audioPath == false) {
        setSendMsgLoader(false);
        return
      }
    }



    if (!!edit?._id) {

      let postData = {
        broadcast_id: chatId,
        message: msg.text.trim(),
        image: imagePath,
        message_content_type: "text",
        message_type: broadcastType.type == 1 ? "publish" : "schedule",
        add_as_personal_note: broadcastType?.addAsNote
      }
      if (broadcastType.type == 2) {
        postData['schedule_time'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date) + " " + broadcastType.scheduleTime, "DD-MM-YYYY HH:mm").toISOString();
        postData['schedule_date'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date), "DD-MM-YYYY").toISOString();
        postData['schedule_date_time'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date) + " " + broadcastType.scheduleTime, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm");
      }


      if (!!audioPath) {
        postData['audio_duration'] = String(recordedAudio?.audioTime);
        postData['audio_url'] = audioPath;
        postData['message_content_type'] = "audio";
      }



      updateMsgToServer(postData, edit?._id)

      // const postData = {
      //   message: msg.text.trim(),
      //   message_id: edit?.id,
      //   image: imagePath
      // };
      // console.log('update_chat_message', postData)
      // socket.emit('update_chat_message', postData)
      // setMsg({ text: "", image: "" })
      // setRecordedAudio(null)
      // clearEdit?.()
    } else {

      let postData = {
        broadcast_id: chatId,
        message: msg.text.trim(),
        image: imagePath,
        message_content_type: "text",
        message_type: broadcastType.type == 1 ? "publish" : "schedule",
        add_as_personal_note: broadcastType?.addAsNote
      }
      if (broadcastType.type == 2) {
        postData['schedule_time'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date) + " " + broadcastType.scheduleTime, "DD-MM-YYYY HH:mm").toDate();
        postData['schedule_date'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date), "DD-MM-YYYY").toDate();
        postData['schedule_date_time'] = moment(moment(broadcastType.scheduleDate).format(dateTimeFormat.date) + " " + broadcastType.scheduleTime, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm");
      }


      if (!!audioPath) {
        postData['audio_duration'] = String(recordedAudio?.audioTime);
        postData['audio_url'] = audioPath;
        postData['message_content_type'] = "audio";
      }


      sendMesgToServer(postData)
    }


  }


  const sendMesgToServer = async (data) => {

    let res = await SEND_BROADCAST_MESSAGE({ token, navigation, body: data });
    if (res.code == 200) {
      showToast({ type: "success", title: res?.message });
      setMsg({ text: "", image: "" })
      if (data.message_type == "publish") {
        socket.emit("publish_broadcast_message", res);
      }
      setRecordedAudio(null)
      setSendMsgLoader(false);
      closeBroadcastModal?.();
      setChat((list) => [res?.broadcast_message, ...list])
    } else {
      setSendMsgLoader(false);
    }
  }


  const updateMsgToServer = async (data, messageId) => {
    let res = await EDIT_SCHEDULE_BROADCAST_MESSAGE({ token, navigation, body: data, chatId, messageId });
    if (res.code == 200) {
      showToast({ type: "success", title: res?.message });
      setChat((list) => {
        let index = list.findIndex(x => x._id == messageId);
        if (index > -1) {
          list.splice(index, 1, res?.broadcast_message);
        }
        return [...list]
      })
      if (data.message_type == "publish") {
        socket.emit("publish_broadcast_message", res);
      }
      clearEdit?.()
      setSendMsgLoader(false);
      setBroadcastType({ isVisible: false, type: 1, scheduleDate: moment(), scheduleTime: "00:00" });
    } else {
      setSendMsgLoader(false);
    }
  }



  const modifyText = (type, linkTitle = "", url = "") => {

    if (!!selection && type == "bold") {
      let textToReplace = msg.text.slice(selection?.start, selection?.end);
      let newTextToBeAddedd = "**" + textToReplace + "**";
      let message = msg.text;
      let newMessage = message.replace(textToReplace, newTextToBeAddedd);
      setMsg({ ...msg, text: newMessage })
    } else if (!!selection && type == "italic") {
      let textToReplace = msg.text.slice(selection?.start, selection?.end);
      let newTextToBeAddedd = "*" + textToReplace + "*";
      let message = msg.text;
      let newMessage = message.replace(textToReplace, newTextToBeAddedd);
      setMsg({ ...msg, text: newMessage })
    } else if (type == "link") {
      let message = msg.text;
      let link = `[${linkTitle}](${url})`;
      message = message.slice(0, selection?.start) + link + message.slice(selection?.start);
      setMsg({ ...msg, text: message })
    }

  }


  //  audio player



  const recordingView = () => {
    return (
      <View style={__style.recorderRootView} >
        <View style={__style.recorderView}>

          <TouchableOpacity
            onPress={stopReorder}
            style={[__style.sendButtonView, { width: 25, height: 25 }]}>
            {icons.crosss(colors.primary, 18)}
          </TouchableOpacity>

          <View style={__style.recorderProgressView} >
            <ProgressBar
              progress={recorderTime.recordTimeInMillis / 300000}
              color={colors.primary}
            />
          </View>

          <View>
            <MyText>{recorderTime.recordTime}</MyText>
          </View>

        </View>
        <TouchableOpacity
          onPress={sendAudioMsg}
          style={[__style.sendButtonView,]}>
          {icons.send(colors.primary, 18)}
        </TouchableOpacity>
      </View>)
  }


  // Link add 
  const closeLinkModal = () => {
    setLinkModal({ isVisible: false, link: "", title: "" });
  }

  const addLink = () => {
    if (linkModal?.title?.trim() == "") {
      showToast({ body: "Please enter title", });
    } else if (linkModal?.link?.trim() == "") {
      showToast({ body: "Please enter link", });
    } else if (!isUrl(linkModal?.link?.trim())) {
      showToast({ body: "Link not valid", });
    } else {
      modifyText("link", linkModal?.title.trim(), linkModal?.link.trim())
      closeLinkModal();
    }

  }

  const modalLink = () => {
    return (
      <Modal
        isVisible={linkModal.isVisible}
        onBackButtonPress={closeLinkModal}
        onBackdropPress={closeLinkModal}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
      >
        <SafeAreaView>
          <View style={{ backgroundColor: colors.secondary, padding: 20, borderRadius: 10 }}>
            <View style={{ marginVertical: 10 }}>
              <MyText align='center' type="medium" fontSize={18} color={colors.primary} >Enter your link</MyText>
            </View>
            <View style={{ marginTop: 10 }}>
              <MyInputs
                label='Title'
                value={linkModal.title}
                onChangeText={title => setLinkModal({ ...linkModal, title })}
              />

              <MyInputs
                label='Link'
                value={linkModal.link}
                onChangeText={Weblink => setLinkModal({ ...linkModal, link: Weblink })}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={closeLinkModal} />
              <TransparentButton title='ADD' onPress={addLink} />
            </View>
          </View>
        </SafeAreaView>
        {linkModal.isVisible && <Toast />}
      </Modal>
    )
  };

  // Broadcast Modal 
  const closeBroadcastModal = () => {
    if (!!edit?._id) {
      setBroadcastType({ ...broadcastType, isVisible: false });
    } else {
      setBroadcastType({ isVisible: false, type: 1, scheduleDate: moment(), scheduleTime: "00:00" });
    }
  }

  const broadcastTypeModal = () => {
    return (
      <Modal
        isVisible={broadcastType.isVisible}
        onBackButtonPress={closeBroadcastModal}
        onBackdropPress={closeBroadcastModal}
        useNativeDriverForBackdrop={true}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        avoidKeyboard={true}
        style={{ margin: 10 }}
      >
        <SafeAreaView>
          <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 20, borderRadius: 10, paddingTop: 20, paddingBottom: 10 }}>
            <View style={{ alignItems: "center", paddingBottom: 20 }}>
              <MyText isHeading>Broadcast</MyText>
            </View>
            <View style={__style.radioRootView}>
              <MyText isLabel>Message Schedule</MyText>
              <View style={__style.radioView}>
                <View style={__style.radioItem}>
                  <MyCheckBox
                    title='Send Now'
                    onPress={() => setBroadcastType({ ...broadcastType, type: 1 })}
                    value={broadcastType?.type == 1}
                  />
                </View>
                <View style={__style.radioItem}>
                  <MyCheckBox
                    title='Schedule'
                    onPress={() => setBroadcastType({ ...broadcastType, type: 2 })}
                    value={broadcastType?.type == 2}
                  />
                </View>
              </View>
            </View>

            <Collapsible collapsed={broadcastType.type == 1}>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={{ flex: 1 }}>
                  <MyTouchableInput
                    label='Publish Date *'
                    icon={() => icons.calendar(colors.primary)}
                    onPress={() => ref_calendar?.current?.openModal(broadcastType.scheduleDate)}
                    value={moment(broadcastType?.scheduleDate).format(dateTimeFormat.date)}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <MyTouchableInput
                    label='Publish Time *'
                    icon={icons.clock}
                    onPress={() => ref_timePicker?.current?.openModal(broadcastType.scheduleTime)}
                    value={moment(broadcastType?.scheduleTime, "HH:mm").format(dateTimeFormat.time)}
                  />
                </View>
              </View>
              <View style={{ marginTop: -10 }}>
                <MyText fontSize={12} isLabel>{"Publish date and time is in Europe/Dublin timezone"}</MyText>
              </View>
            </Collapsible>

            <View style={{ marginVertical: 10 }}>
              <MyCheckBox
                title="Add as Personal Note"
                isNormalText
                value={broadcastType?.addAsNote}
                onPress={() => setBroadcastType({ ...broadcastType, addAsNote: !broadcastType?.addAsNote })}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
              <TransparentButton title='CANCEL' onPress={closeBroadcastModal} />
              {sendMsgLoader ?
                <SimpleLoader size={20} />
                : <TransparentButton title='SEND' onPress={sendMessage} />}
            </View>

            <CalendarModal
              ref={ref_calendar}
              onDateSelected={(date) => setBroadcastType({ ...broadcastType, scheduleDate: date })}
            />

            <TimePicker
              ref={ref_timePicker}
              onAgree={(time) => setBroadcastType({ ...broadcastType, scheduleTime: time })}
            />

          </View>
        </SafeAreaView>
        {broadcastType.isVisible && <Toast />}
      </Modal>
    )
  };


  let displayImage = !!msg.image?.uri ? msg?.image?.uri : !!msg?.image ? S3_URL + msg?.image : "";
  return (
    <View>
      {isRecording ? recordingView() :
        <>
          {!!msg.image &&
            <Pressable
              onPress={() => setImageZommer(displayImage)}
              style={{ alignSelf: "flex-start", marginTop: 15 }}>
              <MyImage
                source={{ uri: displayImage }}
                style={{ height: 60, width: 60 }}
                imageStyle={{ borderRadius: 10, borderWidth: 1 / 2, borderColor: colors.white }}
              />
              <TouchableOpacity
                onPress={() => setMsg({ ...msg, image: "" })}
                style={__style.imageRemoveBtn} >
                {icons.crosssWithCircle_20(colors.delete, 20)}
              </TouchableOpacity>
            </Pressable>
          }
          <View style={{ paddingTop: 10, flexDirection: "row", alignItems: "flex-end" }}>

            <View style={__style.sendMsgInputView}>
              <View style={__style.inputRootView}>
                <TouchableHighlight
                  underlayColor={colors.secondarySelect}
                  onPress={() => setImageModalVisiblity(true)}
                  style={__style.textinputIconView} >
                  <Image source={icons.addImage} style={[__style.textinputIcon, { tintColor: colors.primary }]} />
                </TouchableHighlight>
                <TextInput
                  style={__style.sendMsgInput}
                  value={msg.text}
                  onChangeText={(text) => setMsg({ ...msg, text })}
                  placeholder='Write your message...'
                  placeholderTextColor={colors.lightText}
                  selectionColor={colors.selection}
                  multiline={true}
                  // textAlignVertical='top'
                  keyboardAppearance='dark'
                  autoCorrect={false}
                  autoCapitalize='none'
                  autoComplete='off'
                  onSelectionChange={(e) => {
                    selection = e?.nativeEvent?.selection
                  }}
                />
                <TouchableHighlight
                  underlayColor={colors.secondarySelect}
                  onPress={() => setEditorVisiblity(!isEditorVisible)}
                  style={__style.textinputIconView} >
                  <Image source={icons.textEdit}
                    style={[__style.textinputIcon, !isEditorVisible && { tintColor: colors.primary2 }]}
                  />
                </TouchableHighlight>
              </View>
              <Collapsible collapsed={isEditorVisible}>
                <View style={__style.editorView}>
                  <TouchableOpacity
                    onPress={() => modifyText("bold")}
                    style={__style.editorBotton}>
                    {icons.bold(colors.primary2, 17)}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => modifyText("italic")}
                    style={__style.editorBotton}>
                    {icons.italic(colors.primary2, 17)}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setLinkModal({ title: "", link: "", isVisible: true })}
                    style={__style.editorBotton}>
                    {icons.link(colors.primary2, 17)}
                  </TouchableOpacity>
                </View>
              </Collapsible>
            </View>

            <TouchableOpacity
              onPress={!!msg.text.trim() || !!msg.image ? sendMsgButton : recordBtn}
              disabled={fileLoader}
              style={__style.sendButtonView}>
              {fileLoader ?
                (<SimpleLoader />) :
                !!msg.text.trim() || !!msg.image ?
                  icons.send(colors.primary, 18) :
                  icons.mic(colors.primary, 18)
              }
            </TouchableOpacity>
            {!!edit?._id &&
              <TouchableOpacity
                onPress={() => {
                  setBroadcastType({ isVisible: false, type: 1, scheduleDate: moment(), scheduleTime: "00:00" });
                  setMsg({ text: "", image: "" })
                  setRecordedAudio(null)
                  clearEdit?.()
                }}
                style={__style.sendButtonView}>
                {icons.crosss(colors.primary, 18)}
              </TouchableOpacity>
            }
          </View>
        </>}

      {modalLink()}
      {broadcastTypeModal()}
      <ImageUploadModal
        isVisible={isImageModalShown}
        closeModal={() => setImageModalVisiblity(false)}
        onImagePicked={(image) => setMsg({ ...msg, image })}
      />
      <ImageZoomer
        visible={!!imageZommer}
        closeModal={() => setImageZommer("")}
        url={imageZommer}
        noUrl={true}
      />
    </View>
  )
}

export default SendMsgView

const __style = StyleSheet.create({
  sendButtonView: {
    marginLeft: 5,
    height: 38,
    width: 38,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 38 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS == "android" ? 10 : 0

  },
  sendMsgInputView: {
    flex: 1,
    minHeight: 40,
    maxHeight: Platform.OS == "android" ? 120 : 100,
    backgroundColor: colors.secondaryVariant,
    borderRadius: 15,
    paddingVertical: 5,
    marginBottom: Platform.OS == "android" ? 10 : 0
  },
  inputRootView: {
    flexDirection: "row",
    alignItems: "flex-end",
    // marginBottom: Platform.OS == "android" ? 10 : 0


  },
  sendMsgInput: {
    flex: 1,
    minHeight: 30,
    maxHeight: 70,
    color: colors.white,
    fontFamily: fonts.regular,
    includeFontPadding: false,
    paddingVertical: 0,
  },

  textinputIcon: {
    height: 22,
    width: 22,
    tintColor: colors.lightText,

  },
  textinputIconView: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
    borderRadius: 30 / 2,
    marginHorizontal: 5
  },

  editorView: {
    height: Platform.OS == "android" ? 40 : 30,
    // backgroundColor:colors.darkSecondary,
    borderTopColor: colors.lightText,
    borderTopWidth: 1 / 3,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 3,
    marginTop: 5
  },
  editorBotton: {
    // marginTop:10,
    padding: 5,
    marginLeft: 10
  },
  imageRemoveBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 100,

  },
  recorderRootView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  recorderView: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 15,
    height: 40,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 10,
    flex: 1
  },
  recorderProgressView: {
    paddingHorizontal: 15,
    flex: 1
  },

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
