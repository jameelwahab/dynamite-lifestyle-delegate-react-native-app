import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyInputs from '../../../components/MyInputs'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import MyText from '../../../components/MyText'
import MyCheckBox from '../../../components/MyCheckBox'
import { MyButton, MyClearButton } from '../../../components/MyButton'
import CalendarModal from '../../../components/CalendarModal'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import Collapsible from 'react-native-collapsible'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import routes from '../../../navigation/routes'
import showToast from '../../../functions/showToast'

const TeamFilterScreen = ({ navigation, route }) => {
  const ref_calendar = useRef()
  const [filters, updateFilters] = useState(route?.params?.filters);
  const setFilters = (update) => {
    updateFilters({ ...filters, ...update })
  }

  const onSubmitButtonPress = () => {
    if (!!filters?.start_date && !filters.end_date) {
      showToast({ title: "Alert", body: "Please select end date" })
    } else if (!filters?.start_date && !!filters.end_date) {
      showToast({ title: "Alert", body: "Please select start date" })
    } else {
      navigation.navigate(routes.salesTeamListing, { filters })
    }
  }

  const onResetButtonPress = () => {
    navigation.navigate(routes.salesTeamListing, {
      filters: {
        commission_from: 0,
        commission_to: 0,
        end_date: null,
        start_date: null,
        search_by_commission: false,
        status: true
      }
    })
  }



  return (
    <RootView title='Filter' >
      <MyKeyboardAvoidingView
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false} >

        <MyTouchableInput
          label='Start Commission Date'
          value={!!filters?.start_date ? moment(filters?.start_date).format(dateTimeFormat.date) : ""}
          icon={() => icons.calendar(colors.primary)}
          onPress={() => ref_calendar?.current?.openModal(filters?.start_date, "start_date")}
        />

        <MyTouchableInput
          label='End Commission Date'
          value={!!filters?.end_date ? moment(filters?.end_date).format(dateTimeFormat.date) : ""}
          icon={() => icons.calendar(colors.primary)}
          onPress={() => ref_calendar?.current?.openModal(filters?.end_date, "end_date")}
        />


        <View style={__styles.radioRootView}>
          <MyText isLabel>Status*</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                onPress={() => setFilters({ status: true })}
                value={filters?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                onPress={() => setFilters({ status: false })}
                value={!filters?.status}
              />
            </View>
          </View>
        </View>


        <View style={{ marginTop: 10 }}>
          <MyCheckBox
            title='Search By Commission Due'
            onPress={() => setFilters({ search_by_commission: !filters?.search_by_commission })}
            value={filters?.search_by_commission}
          />
        </View>

        <Collapsible collapsed={!filters?.search_by_commission}>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <MyInputs
                label='Commission From*'
                value={String(filters?.commission_from)}
                onChangeText={(text) => setFilters({ commission_from: text })}
                keyboardType='number-pad'
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyInputs
                label='Commission To*'
                value={String(filters?.commission_to)}
                onChangeText={(text) => setFilters({ commission_to: text })}
                keyboardType='number-pad'
              />
            </View>
          </View>
        </Collapsible>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          {/* {(!!appliedFilters?.createdFor) ? */}
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onResetButtonPress}
          />
          {/* : <View style={[{ marginRight: 11 }, __styles.btn]} />} */}


          <MyButton
            style={{ flex: 1 }}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>


      </MyKeyboardAvoidingView>

      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(date, type) => setFilters({ [type]: date })}
      />
    </RootView >
  )
}

export default TeamFilterScreen

const __styles = StyleSheet.create({
  radioRootView: {

    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },

})