import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyInputs from '../../components/MyInputs'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, TransparentButton } from '../../components/MyButton'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import moment from 'moment'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars'
import { fonts } from '../../utilities/fonts'

const FilterScreen = ({ navigation, route }) => {
  const { filter, filterTheData } = route?.params;
  const [isCalendarModalVisible, setCalendarModalVisiblity] = useState(false)
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [calendarFor, setCalendarFor] = useState("");

  const [filterDates, setFilterDates] = useState({
    from: !!filter?.start_date ? filter?.start_date : "",
    to: !!filter?.end_date ? filter?.end_date : "",
  });

  const filterAction = () => {
    filterTheData?.({
      start_date: filterDates.from,
      end_date: filterDates.to,
    });
    navigation.goBack()
  }



  const onAgreeClick = () => {
    if (calendarFor == "from") {
      setFilterDates({ ...filterDates, from: date });
      setCalendarFor("");
      setCalendarModalVisiblity(false);
    } else if (calendarFor == "to") {
      setFilterDates({ ...filterDates, to: date })
      setCalendarFor("");
      setCalendarModalVisiblity(false);
    }
  }

  const CalendarModal = () => {
    return (
      <Modal
        isVisible={isCalendarModalVisible}
        onBackdropPress={() => setCalendarModalVisiblity(false)}
        onBackButtonPress={() => setCalendarModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            {/* <View style={{ margin: 10 }}>
              <MyText fontSize={18} type='medium' color={colors.primary}>Are you sure you want to move this ticket to needs fixes?</MyText>
            </View> */}
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
                  todayTextColor: 'white',
                  // todayBackgroundColor: colors.,
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
                  console.log(day, "onDayPress")
                  setDate(day.dateString)
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={() => setCalendarModalVisiblity(false)} />
              <TransparentButton title='AGREE' onPress={onAgreeClick} />
            </View>

          </View>
        </SafeAreaView>
      </Modal>)
  }



  return (
    <RootView title='Filter' >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 10 }}>
          <MyTouchableInput
            label='From*'
            placeholder='YYYY-MM-DD'
            icon={() => icons.calendar(colors.primary, 20)}
            value={filterDates.from}
            onPress={() => {
              if (!!filterDates.from) {
                setDate(filterDates.from);
              }
              setCalendarFor("from");
              setCalendarModalVisiblity(true);

            }}
          />


          <MyTouchableInput
            label='To*'
            placeholder='YYYY-MM-DD'
            value={filterDates.to}
            icon={() => icons.calendar(colors.primary, 20)}
            onPress={() => {
              if (!!filterDates.to) {
                setDate(filterDates.to);
              }
              setCalendarFor("to");
              setCalendarModalVisiblity(true)
            }}
          />

          <View style={{ marginTop: 10 }}>
            <MyButton
              title='Filter'
              onPress={filterAction}
            />
          </View>
        </ScrollView>
      </View>

      {CalendarModal()}
    </RootView>
  )
}

export default FilterScreen