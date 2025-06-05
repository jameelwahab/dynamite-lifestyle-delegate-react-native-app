import { View, Text } from 'react-native'
import React from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'



const StatView = ({ title, value, view = null, flex = 1, uppercase = false, border = 1 / 4, original = false, numberOfLinesValues = undefined }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: border, borderBottomColor: colors.lightText, paddingBottom: 10, marginTop: 10, }}>
      <View style={{ flex: 0.7 }}>
        <MyText fontSize={12} color={colors.lightText2}>{title}</MyText>
      </View>
      <View style={{ flex: flex }}>
        {!!view ? view() :
          <MyText numberOfLines={numberOfLinesValues} style={{ textTransform: original ? undefined : uppercase ? "uppercase" : "capitalize" }} fontSize={12} type='medium' >{value}</MyText>}
      </View>
    </View>
  )
}

export default StatView
