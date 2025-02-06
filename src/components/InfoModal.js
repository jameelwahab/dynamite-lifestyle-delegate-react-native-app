import { View, SafeAreaView, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux';
import { selectTimeZone } from '../redux/reducers/timezoneSlice';
import MyText from './MyText';
import { icons } from '../utilities/icons';
import { colors } from '../utilities/colors';
import MyWebview from './MyWebview';

const InfoModal = forwardRef(({ header, footer }, ref) => {
  const [isVisible, setVisiblity] = useState(false);
  const screen = useWindowDimensions()
  const [text, setText] = useState("");
  const [subText, setSubText] = useState("");
  const [isHtml, setIsHtml] = useState("");
  const [extra, setExtra] = useState({
    view: null
  })
  useImperativeHandle(ref, () => {
    return {
      openModal,
    }
  }, [])

  const openModal = (str, str2 = "", isHtml = false, view) => {
    console.log(view, "view")
    setVisiblity(true)
    setText(str)
    setSubText(str2)
    setIsHtml(isHtml)
    if (view) {
      setExtra({ view: view })
    }
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
          <View style={__style.headingView}>
            <Pressable
              hitSlop={{ top: 10, left: 10, right: 10, left: 10 }}
              style={{ marginBottom: 10, marginRight: 5 }}
              onPress={closeScheduleTimeModal}>
              {icons.crosssWithCircle(colors.white, 25)}
            </Pressable>
          </View>

          <View style={__style.modalView}>
            <View style={{ flexDirection: "row" }}>
              {header?.()}
            </View>
            <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
              {!!extra?.view ? extra?.view :
                <>
                  {isHtml ?
                    <View style={{ alignItems: "center" }}>
                      <MyWebview
                        // width={screen.width - 40}
                        fullWidth
                        html={text} />
                    </View> :
                    <MyText>{text}</MyText>}

                  {!!subText && <View style={{ marginTop: 5 }}>
                    <MyText fontSize={12} type='medium' color={colors.lightGrey} >{subText}</MyText>
                  </View>}
                </>}
            </View>
            {footer?.()}
          </View>
        </View>
      </Modal >)
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

    // backgroundColor: colors.secondaryVariant,
    // height: utilities.screenHeight() / 2,
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 5

  },
  modalView: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    padding: 10
  },
  headingView: {
    // flex: 1,
    alignItems: "flex-end"
  },
})
