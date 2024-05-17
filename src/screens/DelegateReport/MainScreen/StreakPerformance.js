import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'

const StreakPerformance = ({ data, modalRef }) => {


  const row = (label, value, arr) => {
    return (
      <TouchableOpacity
        onPress={() => modalRef?.current?.openModal(label.split(" ")[0], arr,data)}
        style={{ flexDirection: "row", paddingVertical: 3 }}>
        <View style={{ flex: 2 }}>
          <MyText style={__styles.text} >{label}:</MyText>
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={__styles.text} >{value}</MyText>
        </View>
      </TouchableOpacity>

    )
  }

  if (data?.attitude_performance_rate_avg != undefined) {
    let total = (data?.attitude_performance_rate_avg + data?.focus_performance_rate_avg +
      data?.desire_performance_rate_avg + data?.discipline_performance_rate_avg + data?.win_note_performance_rate_avg) / 5;
    return (
      <View style={__styles.rootView} >
        <MyText fontSize={14} color={colors.primary} >
          {`Streak Performance Analysis from ${data?.start_date} to ${data?.end_date}`}</MyText>

        <View>
          {row("Attitude Average", data?.attitude_performance_rate_avg.toFixed(2), data?.attitude_performance_rate_array)}
          {row("Focus Average", data?.focus_performance_rate_avg.toFixed(2), data?.focus_performance_rate_array)}
          {row("Desires Average", data?.desire_performance_rate_avg.toFixed(2), data?.desire_performance_rate_array)}
          {row("Discipline Average", data?.discipline_performance_rate_avg.toFixed(2), data?.discipline_performance_rate_array)}
          {row("Win Average", data?.win_note_performance_rate_avg.toFixed(2), data?.win_note_performance_rate_array)}
          {row("Completed Average", (total)?.toFixed(2))}
        </View>

        {/* <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2 }}>
            <MyText style={__styles.text} >Attitude Average:</MyText>
            <MyText style={__styles.text}>Focus Average:</MyText>
            <MyText style={__styles.text}>Desires Average:</MyText>
            <MyText style={__styles.text}>Discipline Average:</MyText>
            <MyText style={__styles.text}>Win Average:</MyText>
            <MyText style={__styles.text}>Completed Average:</MyText>
          </View>

          <View style={{ flex: 1 }}>
            <MyText style={__styles.text} >{data?.attitude_performance_rate_avg.toFixed(2)}</MyText>
            <MyText style={__styles.text}>{data?.focus_performance_rate_avg.toFixed(2)}</MyText>
            <MyText style={__styles.text}>{data?.desire_performance_rate_avg.toFixed(2)}</MyText>
            <MyText style={__styles.text}>{data?.discipline_performance_rate_avg.toFixed(2)}</MyText>
            <MyText style={__styles.text}>{data?.win_note_performance_rate_avg.toFixed(2)}</MyText>
            <MyText style={__styles.text}>{(total)?.toFixed(2)}%</MyText>
          </View>
        </View> */}
      </View>
    )
  } else return null
}

export default StreakPerformance

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.darkSecondary,
    marginTop: 5,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    marginTop: 5
  }
})