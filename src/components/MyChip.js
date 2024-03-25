import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../utilities/icons'
import { colors } from '../utilities/colors'
import utilities from '../utilities'
import MyText from './MyText'

const MyChip = ({ title, onPress }) => {

  return (
    <View style={__styles.chipView}>
      <View style={{}}>
        <MyText fontSize={12} color={colors.white} >{title}</MyText>
      </View>
      {!!onPress &&
        <TouchableOpacity
          onPress={onPress}
          style={__styles.chipBtn}>
          {icons.crosss(colors.primary, 15)}
        </TouchableOpacity>}
    </View>
  )

}

export default MyChip

const __styles = StyleSheet.create({
  chipView: {
    paddingVertical: 2,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colors.chip,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    margin: 2,
    maxWidth: utilities.screenWidth() - 40,
    // marginLeft: 10
  },
  chipBtn: {
    marginLeft: 5,
    height: 20,
    width: 20,
    backgroundColor: colors.black,
    alignItems: "center", justifyContent: "center",
    borderRadius: 20 / 2,
    marginRight: -5
  }
})