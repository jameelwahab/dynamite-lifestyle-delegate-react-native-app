import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal';
import { Picker } from 'react-native-wheel-pick';
import { colors } from '../utilities/colors';
import MyText from './MyText';
import moment from 'moment';
import { TransparentButton } from './MyButton';
import { pick } from 'react-native-document-picker';
import { icons } from '../utilities/icons';

const TimePicker = forwardRef(({ onAgree }, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hours, setHours] = useState("12")
  const [mins, setMins] = useState("00");
  const [amPm, setAmPm] = useState("AM");
  const [type, setType] = useState("");

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])



  const onAgreeClick = () => {
    let result = moment(hours + ":" + mins + " " + amPm, "hh:mm A").format("HH:mm");
    onAgree?.(result, type);
    closeModal?.()
  }

  const openModal = (time, type = "") => {
    if (time) {
      setMins(moment(time, "HH:mm").format("mm"))
      setHours(moment(time, "HH:mm").format("hh"))
      setAmPm(moment(time, "HH:mm").format("A"))
    }
    if (type) {
      setType(type)
    }
    setIsVisible(true)
  }

  const closeModal = () => {
    setType("")
    setIsVisible(false)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn='zoomIn'
      animationOut='zoomOut'
      hideModalContentWhileAnimating
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 10 }}>
        <View style={__styles.rootView}>
          <View style={__styles.row}>
            <View style={{}}>
              <View style={__styles.headingView}>
                <MyText fontSize={16} type='medium' align='center' color={colors.white} >Hours</MyText>
              </View>
              <View style={__styles.pickerOuterView}>
                {icons.upward(colors.primary)}
                <Picker
                  style={__styles.pickerView}
                  textColor={colors.primary}
                  itemStyle={__styles.itemView}
                  selectedValue={hours}
                  pickerData={hoursList}
                  useNativeAndroidPickerStyle={true}
                  onValueChange={value => setHours(value)}

                />
                {icons.downward(colors.primary)}
              </View>
            </View>
            <View style={{ marginLeft: 10 }}>
              <View style={__styles.headingView}>
                <MyText fontSize={16} type='medium' align='center' color={colors.white} >Mins</MyText>
              </View>
              <View style={__styles.pickerOuterView}>
                {icons.upward(colors.primary)}
                <Picker
                  style={__styles.pickerView}
                  textColor={colors.primary}
                  itemStyle={__styles.itemView}
                  selectedValue={mins}
                  useNativeAndroidPickerStyle={true}
                  pickerData={minsList}
                  onValueChange={value => setMins(value)}
                />
                {icons.downward(colors.primary)}
              </View>
            </View>

            <View style={{ marginLeft: 10 }}>
              <View style={__styles.headingView}>
                <MyText fontSize={16} type='medium' align='center' color={colors.white} >AM/PM</MyText>
              </View>
              <View style={__styles.pickerOuterView}>
                {icons.upward(colors.primary)}
                <Picker
                  style={__styles.pickerView}
                  textColor={colors.primary}
                  itemStyle={__styles.itemView}
                  selectedValue={amPm}
                  pickerData={["AM", "PM"]}
                  useNativeAndroidPickerStyle={true}
                  onValueChange={value => setAmPm(value)}
                />
                {icons.downward(colors.primary)}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10, width: "100%", paddingBottom: 10 }}>
            <TransparentButton title='CANCEL' onPress={closeModal} />
            <TransparentButton title='AGREE' onPress={onAgreeClick} />
          </View>
        </View>
    </Modal>
  )
})

export default TimePicker



const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    alignItems: "center",
    borderRadius: 10
  },
  row: { flexDirection: "row" },
  headingView: { marginTop: 20 },
  pickerOuterView: { marginVertical: 20, borderRadius: 10, borderRadius: 10, alignItems: "center" },
  pickerView: {
    backgroundColor: colors.secondary,
    width: 100,
    height: 210,
    borderRadius: 10,
    // shadowColor: "#000000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity:  0.18,
    // shadowRadius: 4.59,
    // elevation: 5,
    // borderWidth:1,
    // borderColor:colors.white+"22"
  },
  itemView: {
    fontSize: 14,
  }
})

const hoursList = [
  "01", "02", "03", "04", "05", "06", "07",
  "08", "09", "10", "11", "12"
]

const minsList = [
  "00", "01", "02", "03", "04", "05", "06", "07",
  "08", "09", "10", "11", "12", "13", "14", "15",
  "16", "17", "18", "19", "20", "21", "22", "23",
  "24", "25", "26", "27", "28", "29", "30", "31",
  "32", "33", "34", "35", "36", "37", "38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47",
  "48", "49", "50", "51", "52", "53", "54", "55",
  "56", "57", "58", "59"
]