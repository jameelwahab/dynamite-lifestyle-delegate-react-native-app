import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../components/MyText'
import { colors } from '../../utilities/colors'
import { dateTimeFormat } from '../../utilities/constants'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

const AccountablityTracker = ({ data }) => {
  const navigation = useNavigation();
  if (!!data) {
    return (
      <View style={__styles.rootView} >
        <MyText fontSize={14} color={colors.primary} >
          {`Accountability Analysis from ${data?.date_from} to ${data?.date_to}`}</MyText>

        {!!data?.daily_dynamite && data?.daily_dynamite?.map((item, index) => (
          <View style={__styles.activityView} >
            <View style={__styles.activityRow}>
              <MyText>{item?.date}</MyText>
              <View style={__styles.activityNestedRow}>
                <MyText>{moment(item?.date_time, "YYYY-MM-DD HH:mm").format(dateTimeFormat.time)}</MyText>
              </View>

            </View>
            <View style={{ marginTop: 10 }}>
              <MyText>{item?.statement_array[0]?.option}</MyText>
            </View>
          </View>
        ))}
      </View>
    )
  } else return null
}

export default AccountablityTracker

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.darkSecondary,
    marginTop: 5,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    marginTop: 5
  },
  activityView: {
    padding: 10,
    backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white + "11"
  },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  activityNestedRow: { flexDirection: "row", alignItems: "center" }
})