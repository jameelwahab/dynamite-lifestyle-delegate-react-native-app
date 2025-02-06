import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, MyClearButton, TransparentButton } from '../../components/MyButton'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import moment from 'moment'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars'
import { fonts } from '../../utilities/fonts'
import showToast from '../../functions/showToast'
import { dateTimeFormat } from '../../utilities/constants'

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
    if (!!filterDates.from == false || !!filterDates.to == false) {
      showToast({ body: "Please select start & end date" });
      return
    }
    filterTheData?.({
      start_date: filterDates.from,
      end_date: filterDates.to,
    });
    navigation.goBack()
  }

  const clearfilterAction = () => {
    filterTheData?.({});
    navigation.goBack()
  }


  const onAgreeClick = (dateString) => {
    if (calendarFor == "from") {
      setFilterDates({ ...filterDates, from: dateString });
      setCalendarFor("");
      setCalendarModalVisiblity(false);
    } else if (calendarFor == "to") {
      setFilterDates({ ...filterDates, to: dateString })
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
            <Pressable
              onPress={() => {
                setCalendarModalVisiblity(false)
                setCalendarFor("")
              }}
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
                  // todayBackgroundColor: colors.lightPrimary,
                  // todayBackgroundColor: colors.lightPrimary,
                  // todayButtonFontFamily:fonts.bold,

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
                  setDate(day.dateString);
                  onAgreeClick(day.dateString);
                }}
              />
            </View>

            {/* <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={() => setCalendarModalVisiblity(false)} />
              <TransparentButton title='AGREE' onPress={onAgreeClick} />
            </View> */}

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
            placeholder={dateTimeFormat.date}
            icon={() => icons.calendar(colors.primary, 20)}
            value={!!filterDates.from ? moment(filterDates.from).format(dateTimeFormat.date) : ""}
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
            placeholder={dateTimeFormat.date}
            value={!!filterDates.to ? moment(filterDates.to).format(dateTimeFormat.date) : ""}
            icon={() => icons.calendar(colors.primary, 20)}
            onPress={() => {
              if (!!filterDates.to) {
                setDate(filterDates.to);
              }
              setCalendarFor("to");
              setCalendarModalVisiblity(true)
            }}
          />

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MyClearButton
              style={{ flex: 1, marginRight: 10 }}
              title='Clear Filter'
              onPress={clearfilterAction}
            />
            <View style={{ flex: 1 }}>
              <MyButton
                title='Submit'
                onPress={filterAction}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {CalendarModal()}
    </RootView>
  )
}

export default FilterScreen
