import { View, Text } from 'react-native'
import React from 'react'
import { colors } from '../../../utilities/colors'
import MyText from '../../../components/MyText'
import numFormatter from '../../../functions/numFormatter'

const StatView = ({ member }) => {

  const stat = (title = "", subHeading = "", coinsCount, count) => {
    return (
      <View style={{ backgroundColor: colors.secondaryVariant, paddingHorizontal: 15, paddingVertical: 20, flex: 1, margin: 5, borderRadius: 10 }}>
        <MyText color={colors.primary}  >{title}</MyText>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <View>
            <MyText fontSize={20} type='medium' >{numFormatter(coinsCount, 1)}</MyText>
            <MyText fontSize={12} color={colors.lightText2} type='light' >{!!subHeading ? subHeading : ""}</MyText>
          </View>
          {!!count ?
            <View style={{ borderWidth: 5, borderColor: colors.primary, height: 50, width: 50, borderRadius: 50 / 2, alignItems: "center", justifyContent: "center" }}>
              <MyText fontSize={16} type='medium' >{count}</MyText>
            </View>
            : <View style={{ height: 50, width: 50, }} />}
        </View>

      </View>
    )
  }

  return (
    <View >
      <View style={{ paddingVertical: 10,marginTop:10 }}>
        <MyText fontSize={16} color={colors.primary} align='center' type='bold' >{`Welcome  To ${member?.member?.first_name} ${member?.member?.last_name}'s Profile`}</MyText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {stat("Total Coins Count", "", member?.member?.coins_count, null)}
        {stat("Daily Dynamite", "Total Coins", member?.member?.dynamite_diary_coins_count, member?.dynamite_diary_count)}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {stat("Gratitude Daily", "Total Coins", member?.member?.dynamite_gratitude_coins_count, member?.dynamite_gratitude_count)}
        {stat("Meditation", "Total Coins", member?.member?.mediation_challange_coins_count, member?.dynamite_meditation_count)}
      </View>

    </View>
  )
}

export default StatView