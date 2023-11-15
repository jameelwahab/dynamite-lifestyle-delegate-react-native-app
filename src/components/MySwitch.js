import { View, Text, Switch, StyleSheet } from 'react-native'
import React from 'react'
import { fonts } from '../utilities/fonts'
import { colors } from '../utilities/colors'


const MySwitch = ({ label, value = true, onValueChange }) => {
  return (
    <View style={__styles.rootView}>
      <Text style={__styles.labelText}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.disableText}}
      />
    </View>
  )
}

export default MySwitch

const __styles = StyleSheet.create({
  rootView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  labelText: {
    fontFamily: fonts.regular,
    includeFontPadding: false,
    color: colors.disableText,
    marginBottom: 5,
    marginLeft: 2,
    flex: 1
  },
})