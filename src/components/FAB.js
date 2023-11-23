"use strict";

import { View, Text, TouchableHighlight, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { plus } from '../utilities/icons'
import { colors } from '../utilities/colors'

const FAB = ({ onPress,icon }) => {
  return (
    <TouchableHighlight

      underlayColor={colors.lightPrimary2}
      onPress={onPress}
      style={__style.rootView}>
      {icon()}
    </TouchableHighlight>
  )
}

export default FAB

const __style = StyleSheet.create({
  rootView: {
    height: 45,
    width: 45,
    borderRadius: 45/2,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: colors.white
  },
})



