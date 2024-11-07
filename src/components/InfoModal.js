import { View, SafeAreaView, Pressable, StyleSheet } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux';
import { selectTimeZone } from '../redux/reducers/timezoneSlice';
import MyText from './MyText';
import { icons } from '../utilities/icons';
import { colors } from '../utilities/colors';
import MyWebview from './MyWebview';

const InfoModal = forwardRef(({ header,footer }, ref) => {
  const [isVisible, setVisiblity] = useState(false);
  const [text, setText] = useState("");
  const [subText, setSubText] = useState("");
  const [isHtml, setIsHtml] = useState("");
  useImperativeHandle(ref, () => {
    return {
      openModal,
    }
  }, [])

  const openModal = (str, str2 = "", isHtml = false) => {
    setVisiblity(true)
    setText(str)
    setSubText(str2)
    setIsHtml(isHtml)
  }

  const closeScheduleTimeModal = () => {
    setText("")
    setIsHtml(false)
    setVisiblity(false);
  }


  const modalSchedule = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeScheduleTimeModal}
        onBackButtonPress={closeScheduleTimeModal}
        useNativeDriverForBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        // avoidKeyboard={true}
        style={{ margin: 0, marginHorizontal: 5 }}>
        <View style={__style.rootView}>
          <View style={{ flexDirection: "row" }}>
            {header?.()}
            <View style={__style.headingView}>
              <Pressable
                hitSlop={{ top: 10, left: 10, right: 10, left: 10 }}
                style={{ marginBottom: 10 }}
                onPress={closeScheduleTimeModal}>
                {icons.crosssWithCircle(colors.white, 20)}
              </Pressable>
            </View>
          </View>
          <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
            {isHtml ?
              <MyWebview html={text} /> :
              <MyText>{text}</MyText>}

            {!!subText && <View style={{ marginTop: 5 }}>
              <MyText fontSize={12} type='medium' color={colors.lightGrey} >{subText}</MyText>
            </View>}
          </View>
          {footer?.()}
        </View>
      </Modal>)
  }


  return (
    <View>
      {modalSchedule()}
    </View>
  )
})

export default InfoModal

const __style = StyleSheet.create({
  rootView: {
    // flex: 1,
    borderRadius: 10,
    backgroundColor: colors.secondaryVariant,
    // height: utilities.screenHeight() / 2,
    marginTop: "auto",
    marginBottom: "auto",
    padding: 10
  },
  headingView: {
    flex: 1,
    alignItems: "flex-end"
  },
})