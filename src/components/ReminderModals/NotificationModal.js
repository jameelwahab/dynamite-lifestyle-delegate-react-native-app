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
import Toast from 'react-native-toast-message';
import showToast from '../../functions/showToast';

const NotificationModal = forwardRef(({ onReminderSavePress }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(undefined)

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const onSaveBtnPress = () => {
    if (title.trim() == "") {
      showToast({ title: "Alert", body: "Please enter notification title", type: "info" });
      return
    } else if (message.trim() == "") {
      showToast({ title: "Alert", body: "Please enter notification statement", type: "info" });
      return
    }
    let obj = {
      notification_title: title.trim(),
      description: message,
    }
    onReminderSavePress({
      push_notification_info: obj,
    }, index);
    closeModal();
  }

  const closeModal = () => {
    setIsVisible(false);
    setTitle("");
    setMessage("");
  }

  const openModal = (data, dIndex = undefined) => {
    setIsVisible(true);
    setIndex(dIndex)
    if (!!data) {
      setTitle(!!data?.notification_title ? data?.notification_title : "");
      setMessage(!!data?.description ? data?.description : "")
    }

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
      avoidKeyboard={true}
      style={{ margin: 0, }}>

      <SafeAreaView style={__styles.rootView}>
        <View style={__styles.rootInnerView}>
          <View style={__styles.header}>

            <TitleView
              title={"Push Notification Settings"}
              hideBackBottomButton
            />
            <TouchableOpacity
              onPress={closeModal}
              style={__styles.closeBtn}>
              {icons.crosss(colors.primary)}
            </TouchableOpacity>



          </View>

          <View style={{ flex: 1, marginTop: 20 }}>
            <KeyboardAwareScrollView
              enableResetScrollToCoords={false}
              showsVerticalScrollIndicator={false}>



              <MyInputs
                label='Notification Title*'
                value={title}
                onChangeText={(text) => setTitle(text)}
              />


              <MyInputs
                label='Notification Statement*'
                height={150}
                value={message}
                onChangeText={(text) => setMessage(text)}
                multiline
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
      {isVisible && <Toast />}
    </Modal>
  )
})

export default NotificationModal;

const __styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colors.secondaryVariant,
  },
  rootInnerView: {
    paddingHorizontal: 15,
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
