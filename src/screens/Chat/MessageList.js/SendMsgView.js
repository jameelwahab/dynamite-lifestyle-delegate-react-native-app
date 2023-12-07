import { View, Text, TouchableHighlight, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../utilities/colors'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../../utilities/icons'
import Modal from 'react-native-modal'
import MyInputs from '../../../components/MyInputs'
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
import { UPLOAD_FILE_FOR_CHAT } from '../../../DAL'
import { S3_URL } from '../../../utilities/constants'
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
let selection;

const SendMsgView = ({ receiver, navigation, edit, clearEdit }) => {
  const { socket } = useSelector(selectSocket);
  const { user, token } = useSelector(selectUser);
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isEditorVisible, setEditorVisiblity] = useState(true);
  const [imageZommer, setImageZommer] = useState("")
  const [recorderTime, setRecorderTime] = useState({
    recordTimeInMillis: 0,
    recordTime: "00:00",
  });
  const [isImageModalShown, setImageModalVisiblity] = useState(false);
  const [linkModal, setLinkModal] = useState({ isVisible: false, link: "", title: "" });
  const [isRecording, setRecording] = useState(false);
  const [msg, updateMsg] = useState({
    image: "",
    text: "",
    audio: "",
    audioTime: ""
  });

  const setMsg = (updation) => updateMsg({ ...msg, ...updation })

  useEffect(() => {
    if (!!edit?.id) {
      setMsg({
        image: edit?.image,
        text: edit?.msg,
      })
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

    } else {
      return true
    }
  }

  const recordBtn = async () => {
    let res = await getPermissions();
    if (res) {
      setRecording(true)
      startRecording()
    } else {
      showToast({ body: "Permission denied", title: "Error" })
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

      // Start the recording and get the audio URI
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

      console.log(uri, "uri")


    } catch (error) {
      console.log('Uh-oh! Failed to start recording:', error);
    }
  };

  const stopReorder = async () => {
    let miliis = recorderTime.recordTimeInMillis;
    setRecorderTime({ recordTime: "00:00", recordTimeInMillis: 0, });
    setRecording(false)
    audioRecorderPlayer?.removeRecordBackListener();
    const result = await audioRecorderPlayer?.stopRecorder();
    return {
      uri: result,
      time: miliis
    };
  }

  const sendAudioMsg = async () => {
    let audio = await stopReorder();

    sendMsgButton({
      audio: {
        uri: audio.uri,
        name: audio.uri.split("/").pop(),
        type: "audio/aac"
      },
      audioTime: audio.time
    })
  }


  const uplaodFileOnS3 = async (file, type) => {
    let formData = new FormData();
    formData.append("image", file);
    let resp = await UPLOAD_FILE_FOR_CHAT({ token, navigation, file: formData });
    if (resp.code == 200) {
      return resp
    }

  }

  const sendMsgButton = async (audioObj = null) => {
    if (msg.text.trim() == "" && !!msg.image == false && !!audioObj == false) {
      showToast({ title: "Please write something" })
    } else {
      let imagePath = '';
      let audioPath = '';
      if (!!msg.image?.uri) {
        imagePath = await uplaodFileOnS3(msg.image, 'image').then((res) => res.image_path);
        if (!!imagePath == false) {
          return
        }
      } else if (!!audioObj.audio) {
        audioPath = await uplaodFileOnS3(audioObj.audio, 'audio').then((res) => res.image_path);
        if (!!audioPath == false) {
          return
        }
      }


      if (!!edit?.id) {

        const postData = {
          message: msg.text.trim(),
          message_id: edit?.id,
          image: imagePath
        };
        console.log('update_chat_message', postData)
        socket.emit('update_chat_message', postData)
        setMsg({ text: "", image: "" })
        clearEdit?.()
      } else {

        let postData = {
          receiver_id: receiver?.memberId,
          receiver_type: "member_user",
          message: msg.text.trim(),
          image: imagePath,
          x_sh_auth: token,
        }
        if (!!audioPath) {
          postData['audio_duration'] = audioObj.audioTime;
          postData['audio_url'] = audioPath;
        }


        console.log('send_chat_message', postData)
        socket.emit('send_chat_message', postData)
        setMsg({ text: "", image: "" })

      }

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

    setEditorVisiblity(true)

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
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
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
                  verticalAlign='top'
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
              style={__style.sendButtonView}>
              {!!msg.text.trim() || !!msg.image ?
                icons.send(colors.primary, 18) :
                icons.mic(colors.primary, 18)
              }
            </TouchableOpacity>
            {!!edit?.id &&
              <TouchableOpacity
                onPress={() => {
                  setMsg({ text: "", image: "" })
                  clearEdit?.()
                }}
                style={__style.sendButtonView}>
                {icons.crosss(colors.primary, 18)}
              </TouchableOpacity>
            }
          </View>
        </>}

      {modalLink()}
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
    justifyContent: "center"
  },
  sendMsgInputView: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.secondaryVariant,
    borderRadius: 15,
    paddingVertical: 5,
  },
  sendMsgInput: {
    flex: 1,
    minHeight: 30,
    maxHeight: 70,
    color: colors.white,
    fontFamily: fonts.regular,
    includeFontPadding: false,
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
    height: 30,
    // backgroundColor:colors.darkSecondary,
    borderTopColor: colors.lightText,
    borderTopWidth: 1 / 3,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 3,
    marginTop: 5
  },
  editorBotton: {
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
  }
})
