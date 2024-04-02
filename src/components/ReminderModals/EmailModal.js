import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../utilities/colors';
import { icons } from '../../utilities/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MyInputs from '../MyInputs';
import Editor from '../Editor';
import { MyButton } from '../MyButton';
import MyCheckBox from '../MyCheckBox';
import MyChip from '../MyChip';
import TitleView from '../TitleView';

const EmailModal = forwardRef(({ onReminderSavePress }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [heading, setHeading] = useState("");
  const [email, setEmail] = useState("");
  const [ccText, setCcText] = useState("")
  const [cc, setCc] = useState("");
  const [message, setMessage] = useState("")
  const [body, setBody] = useState("")
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const onSaveBtnPress = () => {
    let obj = {
      cc_emails: cc,
      email_body: body,
      email_message: message.trim(),
      email_subject: subject.trim(),
      main_email: email.trim(),
      status: "",
      title: heading.trim(),
    }
    onReminderSavePress({
      email_notification_info: obj
    });
    closeModal();
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  const openModal = (data) => {
    setIsVisible(true);
    if (!!data) {
      console.log(data, "data")
      setSubject(!!data?.email_subject ? data?.email_subject : "");
      setHeading(!!data?.title ? data?.title : "");
      setEmail(!!data?.main_email ? data?.main_email : "");
      setCc(!!data?.cc_emails ? data?.cc_emails : "");
      setMessage(!!data?.email_message ? data?.email_message : "")
      setBody(!!data?.email_body ? data?.email_body : "")
    }

  }

  const removeCc = (index) => {
    setCc((list) => {
      list.splice(index, 1);
      return [...list]
    })
  }

  const ccView = () => {
    if (cc.length > 0) {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
          {cc.map((x, i) => <MyChip title={x} onPress={() => removeCc(i)} />)}
        </View>
      )
    } else return null
  }

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
              title={"Email Settings"}
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

              <MyInputs
                label='Email Subject*'
                value={subject}
                onChangeText={(text) => setSubject(text)}
              />

              <MyInputs
                label='Email Body Heading*'
                value={heading}
                onChangeText={(text) => setHeading(text)}
              />

              <MyInputs
                label='Main Email'
                value={email}
                onChangeText={(text) => setEmail(text)}

              />

              <MyInputs
                label='CC Emails'
                value={ccText}
                customView={ccView}
                onChangeText={(text) => setCcText(text)}
                rightIcon={ccText.trim() != "" ? () => icons.plus(colors.primary) : null}
                rightIconOnPress={() => {
                  setCc((list) => [...list, ccText]);
                  setCcText("")
                }}
              />

              <Editor
                label='Email Body Message*'
                height={150}
                initialValue={message}
                onChange={(text) => setMessage(text)}
              />

              <MyButton
                title='Save'
                style={{ paddingHorizontal: 15, height: 35, borderRadius: 5 }}
                onPress={onSaveBtnPress}
              />
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
})

export default EmailModal;

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
  }
})