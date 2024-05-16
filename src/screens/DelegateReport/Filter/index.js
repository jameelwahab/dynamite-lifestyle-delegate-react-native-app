import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import { MyButton } from '../../../components/MyButton'
import CalendarModal from '../../../components/CalendarModal'
import moment, { months } from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import showToast from '../../../functions/showToast'
import MonthYearPicker from '../../../components/MonthYearPicker'

const Filter = ({ navigation, route }) => {
  const { filter: appliedFilters, selectedTab } = route?.params
  const ref_month_year_picker = useRef();
  const ref_calendar = useRef();
  const { token, } = useSelector(selectUser);
  const [filters, setFilters] = useState(appliedFilters);



  useEffect(() => {

  }, [])

  const onClearButtonPress = () => {
    navigation.navigate(routes.delegateReportScreen, {
      filters: { start_date: undefined, end_date: undefined, monthYear: moment().format("MM-YYYY") }
    })
  }

  const onSubmitButtonPress = () => {
    if (!!filters.start_date == true && !!filters.end_date == false) {
      showToast({ title: "Please select end date", })
      return
    } else if (!!filters.start_date == false && !!filters.end_date == true) {
      showToast({ title: "Please select start date", })
      return
    }
    navigation.navigate(routes.delegateReportScreen, { filters })
  }



  const onDateSelected = (date, type) => {
    if (type == "start_date") {
      setFilters({ ...filters, start_date: date })
    } else if (type == "end_date") {
      setFilters({ ...filters, end_date: date })
    }
  }




  return (
    <RootView title='Filter' >
      <KeyboardAwareScrollView
        contentContainerStyle={{ marginTop: 10, marginHorizontal: 10 }}>




        {selectedTab == 3 ?
          <MyTouchableInput
            label='Month and Year *'
            icon={() => icons.calendar(colors.primary)}
            onPress={() => ref_month_year_picker?.current?.openModal(filters?.monthYear)}
            value={!!filters?.monthYear ? moment(filters?.monthYear, "MM-YYYY").format("MMM YYYY") : ""}
          />

          :
          <>
            <MyTouchableInput
              label='From *'
              icon={() => icons.calendar(colors.primary)}
              onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "start_date")}
              value={!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : ""}
            />

            <MyTouchableInput
              label='To *'
              icon={() => icons.calendar(colors.primary)}
              onPress={() => ref_calendar?.current?.openModal(filters?.end_date, "end_date")}
              value={!!filters?.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : ""}
            />
          </>
        }








        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.createdFor) ? */}
          <MyButton
            style={[__styles.clearBtn, __styles.btn]}
            textStyle={__styles.clearBtnText}
            invert
            title='Clear Filter'
            onPress={onClearButtonPress}
          />
          {/* : <View style={[{ marginRight: 11 }, __styles.btn]} />} */}


          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>

        <CalendarModal
          ref={ref_calendar}
          onDateSelected={onDateSelected}
        />
        <MonthYearPicker
          ref={ref_month_year_picker}
          onAgree={(monthsSelected) => setFilters({ ...filters, monthYear: monthsSelected })}
        />

      </KeyboardAwareScrollView>
    </RootView>
  )
}

export default Filter


const __styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowItem: {
    flex: 1
  },
  clearBtnText: {
    color: colors.delete
  },
  btn: {
    flex: 1
  },
  clearBtn: {
    // marginTop: 20,
    borderColor: colors.delete,
    backgroundColor: colors.delete + "22",
    marginRight: 10
  },
})