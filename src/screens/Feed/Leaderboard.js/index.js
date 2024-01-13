import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'

const Leaderboard = ({ monthlyCounts, weeklyCounts }) => {

  const userCountsView = (item, index) => {
    return (
      <View style={__styles.countRootView}>
        <UserImage
          image={item?.image?.thumbnail_1}
          name={item?.first_name}
          size={40}
        />
        <View style={__styles.nameView}>
          <MyText type='medium'>{item?.first_name + " " + item?.last_name}</MyText>
        </View>
        <View style={__styles.countView}>
          <MyText color={colors.primary2} type='bold' fontSize={16}>{item?.monthly_count}</MyText>
        </View>
      </View>)
  }

  return (
    <View>
      <View style={__styles.boxView}>
        <View style={__styles.headingView}>
          <MyText fontSize={18} type='medium' >{"Monthly New Leads Leaderboard"}</MyText>
          <View style={__styles.divider} />
        </View>
        <View>
          {monthlyCounts.map(userCountsView)}
        </View>
      </View>


      <View style={__styles.boxView}>
        <View style={__styles.headingView}>
          <MyText fontSize={18} type='medium' >{"Weekly New Leads Leaderboard"}</MyText>
          <View style={__styles.divider} />
        </View>
        <View>
          {weeklyCounts.map(userCountsView)}
        </View>
      </View>


    </View>
  )
}

export default Leaderboard;

const __styles = StyleSheet.create({
  boxView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    // paddingBottom:20
  },
  divider: {
    height: 0.5, width: "100%", backgroundColor: colors.white, marginTop: 20,
    marginBottom: 10
  },
  headingView: {
    // marginTop: 10
  },
  countRootView: { marginTop: 10, flexDirection: "row", alignItems: "center" },
  nameView: {
    flex: 1,
    marginHorizontal: 10
  },
  countView: {
    borderWidth: 2,
    borderColor: colors.white,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center"
  }
})