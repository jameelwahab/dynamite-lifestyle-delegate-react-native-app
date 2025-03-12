import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { icons } from '../utilities/icons'
import { colors } from '../utilities/colors'
import utilities from '../utilities'
import MyText from './MyText'

const MyChip = ({ title, onPress, isCapitalize = false }) => {

  return (
    <View
      style={__styles.chipView}>
      <View style={{}}>
        <MyText capitalize={isCapitalize} fontSize={12} color={colors.white} >{title}</MyText>
      </View>
      {!!onPress &&
        <TouchableOpacity
        hitSlop={{top:5,left:5,bottom:5,right:5}}
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
    minHeight: 22
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