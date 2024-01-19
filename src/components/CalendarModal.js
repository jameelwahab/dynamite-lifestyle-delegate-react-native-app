import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import moment from 'moment'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'
import { dateTimeFormat } from '../utilities/constants'
import { Calendar } from 'react-native-calendars'
import { TransparentButton } from './MyButton'
import { icons } from '../utilities/icons'

const CalendarModal = forwardRef(({ onDateSelected }, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const openModal = () => {
    setIsVisible(true)
  }

  const closeModal = () => {
    setIsVisible(false);
    setDate(moment().format("YYYY-MM-DD"));
  }

  const onAgreeClick = () => {
    setIsVisible(false);
    onDateSelected?.(moment(date, "YYYY-MM-DD"));
    setDate(moment().format("YYYY-MM-DD"));
  }

  const modalCalendar = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            <Pressable
              onPress={closeModal}
              style={{ padding: 5, alignSelf: "flex-end" }}>
              {icons.crosss()}
              {/* <MyText fontSize={18} type='medium' color={colors.primary}>Are you sure you want to move this ticket to needs fixes?</MyText> */}
            </Pressable>
            <View style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, overflow: "hidden" }}>
              <Calendar
                current={date}

                // date={date}
                markedDates={{
                  [date]: { selected: true }
                }}
                theme={{
                  backgroundColor: colors.secondaryVariant,
                  calendarBackground: colors.secondaryVariant,
                  textSectionTitleColor: colors.primary,
                  textSectionTitleDisabledColor: colors.primary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.black,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.white,
                  textDisabledColor: colors.placeholder,
                  dotColor: colors.blue,
                  selectedDotColor: 'blue',
                  arrowColor: colors.primary,
                  disabledArrowColor: colors.primary,
                  monthTextColor: 'white',
                  textDayFontSize: 14,
                  // textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                  textDayFontFamily: fonts.regular,
                  textDayHeaderFontFamily: fonts.regular,
                  textMonthFontFamily: fonts.medium,

                }}
                onDayPress={(day) => {
                  console.log(day,"day")
                  setDate(day.dateString)
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={closeModal} />
              <TransparentButton title='AGREE' onPress={onAgreeClick} />
            </View>

          </View>
        </SafeAreaView>
      </Modal>)
  }

  return (
    <View>
      {modalCalendar()}
    </View>
  )
})

export default CalendarModal