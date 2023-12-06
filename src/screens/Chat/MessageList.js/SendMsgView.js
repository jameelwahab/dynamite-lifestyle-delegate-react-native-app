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
let selection;

const SendMsgView = ({ receiver, navigation, edit, clearEdit }) => {
  const { socket } = useSelector(selectSocket);
  const { user, token } = useSelector(selectUser);
  const [isEditorVisible, setEditorVisiblity] = useState(true);
  const [imageZommer, setImageZommer] = useState("")
  const [isImageModalShown, setImageModalVisiblity] = useState(false);
  const [linkModal, setLinkModal] = useState({ isVisible: false, link: "", title: "" })
  const [msg, setMsg] = useState({
    image: "",
    text: "",
  });


  useEffect(() => {
    if (!!edit?.id) {
      setMsg({
        image: edit?.image,
        text: edit?.msg,
      })
    }
  }, [edit])

  useEffect(() => {
    console.log(msg, "msg useEffect");

  }, [msg])




  useEffect(() => {
    selection = null;
  }, [])

  const uplaodFileOnS3 = async () => {
    let formData = new FormData();
    formData.append("image", msg.image);
    let resp = await UPLOAD_FILE_FOR_CHAT({ token, navigation, file: formData });
    if (resp.code == 200) {
      return resp
    }

  }



  const sendMsgButton = async () => {
    if (msg.text.trim() == "") {
      showToast({ title: "Please write something" })
    } else {
      let imagePath = '';
      if (!!msg.image?.uri) {
        imagePath = await uplaodFileOnS3().then((res) => res.image_path);
        if (!!imagePath == false) {
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

        let isAudio = false;
        let postData = {
          receiver_id: receiver?.memberId,
          receiver_type: "member_user",
          message: msg.text.trim(),
          image: isAudio ? "" : imagePath,
          x_sh_auth: token,
        }
        if (isAudio) {
          postData['audio_duration'] = time;
          postData['audio_url'] = imagePath;
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
          onPress={sendMsgButton}
          style={__style.sendButtonView}>
          {icons.send(colors.primary, 18)}
        </TouchableOpacity>
      </View>
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

  }
})
