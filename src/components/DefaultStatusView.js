import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'

const DefaultStatusView = ({ value, activeText = "Active", inactiveText = "Inactive" }) => {

  return (
    <View style={[{ backgroundColor: value ? colors.green + "33" : colors.delete + "33" }, __styles.badge_container]}>
      <MyText type='medium' color={value ? colors.green : colors.delete} >{value ? activeText : inactiveText}</MyText>
    </View>)
}

export default DefaultStatusView

const __styles = StyleSheet.create({

  badge_container: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
    borderRadius: 10
  },

})
