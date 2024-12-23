import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyInputs from '../MyInputs';
import { MyButton, TransparentButton } from '../MyButton';
import TitleView from '../TitleView';
import Toast from 'react-native-toast-message';
import showToast from '../../functions/showToast';
import { fonts } from '../../utilities/fonts';
import MyText from '../MyText';
import { isUrl } from '../../functions/regex';
import MyCheckBox from '../MyCheckBox';
import MyTouchableInput from '../MyTouchableInput';
import { WHATSAPP_TEMPLATES_LIST } from '../../DAL';
import OptionModal from '../OptionModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { useNavigation } from '@react-navigation/native';
import capitalize from '../../functions/capitalize';

let selection;
const WhatsappModal = forwardRef(({ onReminderSavePress }, ref) => {
  const { token } = useSelector(selectUser);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [optionVisibility, setOptionVisibility] = useState(false)
  const [type, setType] = useState(1)
  const [linkModal, setLinkModal] = useState({ isVisible: false, link: "", title: "" });
  const [templates, setTemplates] = useState([])

  const getTemplatesFromServer = async () => {
    let res = await WHATSAPP_TEMPLATES_LIST({ token, navigation });
    if (res.code == 200) {
      setTemplates(res?.templates);
    }
  }

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const onSaveBtnPress = () => {
    if (type == 2 && msg.trim() == "") {
      showToast({ title: "Alert", body: "Please write a message", type: "info" });
      return
    } else if (type == 1 && selectedTemplate == "") {
      showToast({ title: "Alert", body: "Please select a template", type: "info" });
      return
    }
    let obj;
    if (type == 1) {
      obj = {
        type: "template",
        template: selectedTemplate,
      }
    } else if (type == 2) {
      obj = {
        type: "message",
        whatsappMessage: msg.trim(),
      }
    }
    onReminderSavePress({
      whatsapp_notification_info: obj
    });
    closeModal();
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  const openModal = (data) => {
    getTemplatesFromServer()
    setIsVisible(true);
    if (!!data) {
      setSelectedTemplate(!!data?.template ? data?.template : "");
      setMsg(!!data?.whatsappMessage ? data?.whatsappMessage : "")
      setType(data?.type == "template" ? 1 : 2);
    }

  }

  const modifyText = (type, linkTitle = "", url = "") => {

    if (!!selection && type == "bold") {
      let textToReplace = msg.slice(selection?.start, selection?.end);
      let newTextToBeAddedd = "**" + textToReplace + "**";
      let message = msg;
      let newMessage = message.replace(textToReplace, newTextToBeAddedd);
      setMsg(newMessage)
    } else if (!!selection && type == "italic") {
      let textToReplace = msg.slice(selection?.start, selection?.end);
      let newTextToBeAddedd = "*" + textToReplace + "*";
      let message = msg;
      let newMessage = message.replace(textToReplace, newTextToBeAddedd);
      setMsg(newMessage)
    } else if (type == "link") {
      let message = msg;
      let link = `[${linkTitle}](${url})`;
      message = message.slice(0, selection?.start) + link + message.slice(selection?.start);
      setMsg(message)
    }

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



  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0, }}>

      <SafeAreaView style={__styles.rootView}>
        <View style={__styles.rootInnerView}>
          <View style={__styles.header}>

            <TitleView
              title={"Whatsapp Notification Settings"}
              hideBackBottomButton
            />
            <TouchableOpacity
              onPress={closeModal}
              style={__styles.closeBtn}>
              {icons.crosss(colors.primary)}
            </TouchableOpacity>



          </View>

          <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 10 }}>
            <KeyboardAwareScrollView
              enableResetScrollToCoords={false}
              showsVerticalScrollIndicator={false}>

              <View style={__styles.radioRootView}>
                <MyText isLabel>Notification Type *</MyText>
                <View style={__styles.radioView}>
                  <View style={__styles.radioItem}>
                    <MyCheckBox
                      title='Template'
                      onPress={() => setType(1)}
                      value={type == 1}
                    />
                  </View>
                  <View style={__styles.radioItem}>
                    <MyCheckBox
                      title='Message'
                      onPress={() => setType(2)}
                      value={type == 2}
                    />
                  </View>
                </View>
              </View>

              {type == 1 ?
                <MyTouchableInput
                  label='Template*'
                  onPress={() => setOptionVisibility(true)}
                  value={capitalize(selectedTemplate.replace(/_/g, " "))}
                  capitalize
                /> :
                <>
                  <View style={{ paddingBottom: 5 }}>
                    <MyText color={colors.primary} type='medium' >Whatsapp Message*</MyText>
                  </View>
                  <View style={__style.sendMsgInputView}>
                    <TextInput
                      style={__style.sendMsgInput}
                      value={msg}
                      onChangeText={(text) => setMsg(text)}
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
                  </View>
                </>}

              <MyButton
                title='Save'
                style={{ paddingHorizontal: 15, height: 35, borderRadius: 5, marginTop: 15 }}
                onPress={onSaveBtnPress}
              />
            </KeyboardAwareScrollView>
          </View>

          <OptionModal
            isVisible={optionVisibility}
            optionList={templates}
            onSelected={(opt) => { setSelectedTemplate(opt?.name); setOptionVisibility(false) }}
            checkSelected={(item) => selectedTemplate == item.name}
            closeModal={() => setOptionVisibility(false)}
            renderText={({ item }) =>
              <MyText capitalize fontSize={16}>{item.name.replace(/_/g, " ")}</MyText>}
          />
          {modalLink()}
        </View>
      </SafeAreaView>
      {isVisible && !linkModal?.isVisible && <Toast />}
    </Modal>
  )
})

export default WhatsappModal;

const __styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colors.secondaryVariant,
    paddingHorizontal: 10
  },
  rootInnerView: {
    paddingHorizontal: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.primary + "33",
    alignItems: "center",
    justifyContent: "center",
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
    height: 170,
    backgroundColor: colors.secondarySelect,
    borderRadius: 10,
    padding: 5,
  },
  inputRootView: {
    flex: 1,
    // marginBottom: Platform.OS == "android" ? 10 : 0


  },
  sendMsgInput: {
    flex: 1,
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
    marginTop: 5,

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
  }
})
