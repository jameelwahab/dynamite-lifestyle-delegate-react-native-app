import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, MyClearButton } from '../../components/MyButton'
import { colors } from '../../utilities/colors'
import OptionModal from '../../components/OptionModal'
import routes from '../../navigation/routes'
import { icons } from '../../utilities/icons'
import moment from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
import { Calendar } from 'react-native-calendars'
import CalendarModal from '../../components/CalendarModal'

const Filter = ({ navigation, route }) => {
  const ref_calendar = useRef();
  const [filter, setFilter] = useState(route?.params?.filters);


  const onClearButtonPress = () => {
    navigation.navigate(route?.params?.screen, {
      filters: { date_from: "", date_to: "" }
    })
  }

  const onSubmitButtonPress = () => {
    navigation.navigate(route?.params?.screen, { filters: filter })
  }

  return (
    <RootView title='Filter' >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}>

        <MyTouchableInput
          label='From Date *'
          value={!!filter?.date_from ? moment(filter?.date_from).format(dateTimeFormat.date) : ""}
          onPress={() => ref_calendar?.current?.openModal(filter?.date_from, "date_from")}
          icon={icons.calendar}
        />

        <MyTouchableInput
          label='To Date *'
          value={!!filter?.date_to ? moment(filter?.date_to).format(dateTimeFormat.date) : ""}
          onPress={() => ref_calendar?.current?.openModal(filter?.date_to, "date_to")}
          icon={icons.calendar}
        />



        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onClearButtonPress}
          />



          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>


        <CalendarModal
          ref={ref_calendar}
          onDateSelected={(date, type) => setFilter({ ...filter, [type]: date })}
        />

      </ScrollView>
    </RootView>
  )
}

export default Filter

const communityLevels = [
  {
    title: "All",
    key: "all"
  },
  {
    title: "Dynamite",
    key: "dynamite"
  },
  {
    title: "PTA",
    key: "pta"
  },
  {
    title: "Elite",
    key: "elite"
  },
  {
    title: "VIP Gold",
    key: "mastery"
  },
]


const podTypeList = [
  {
    title: "All",
    key: "all"
  },
  {
    title: "General",
    key: "gernal"
  },
  {
    title: "Automated",
    key: "automated"
  }
]


const __styles = StyleSheet.create({
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