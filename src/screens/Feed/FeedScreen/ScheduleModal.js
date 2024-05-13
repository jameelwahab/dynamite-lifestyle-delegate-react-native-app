import { View, Text, SafeAreaView, Pressable, StyleSheet } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { colors } from '../../../utilities/colors';
import utilities from '../../../utilities';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { convertTimezone, convertTimezoneFrom } from '../../../functions/convertTime';
const ScheduleModal = forwardRef(({ }, ref) => {
  const [isVisible, setVisiblity] = useState(false);
  const [time, setTime] = useState(null);
  const timezone = useSelector(selectTimeZone)
  useImperativeHandle(ref, () => {
    return {
      openScheduleTimeModal,
    }
  }, [])

  const openScheduleTimeModal = (schduleTime) => {
    setVisiblity(true)
    setTime(schduleTime)
  }

  const closeScheduleTimeModal = () => {
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
        animationInTiming={400}
        animationOutTiming={400}
        avoidKeyboard={true}
        style={{ margin: 0, marginHorizontal: 5 }}>

        <View style={__style.rootView}>
          <View style={__style.headingView}>
            <Pressable
              hitSlop={{ top: 10, left: 10, right: 10, left: 10 }}
              onPress={closeScheduleTimeModal}>
              {icons.crosssWithCircle(colors.white, 20)}
            </Pressable>
          </View>
          {!!time &&
            <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
              {/* <MyText>{`Post will be pushlished on ${moment(time).tz(timezone.admin).format(dateTimeFormat.dateTimeWithText("at"))} (Europe/Dublin)`}</MyText> */}
              <MyText>{`Post will be pushlished on ${moment(time).tz(timezone.admin).subtract({ hour: 1 }).format(dateTimeFormat.dateTimeWithText("at"))} (Europe/Dublin)`}</MyText>
            </View>}
        </View>

      </Modal>)
  }


  return (
    <View>
      {modalSchedule()}
    </View>
  )
})

export default ScheduleModal

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

    alignSelf: "flex-end"
  },
})