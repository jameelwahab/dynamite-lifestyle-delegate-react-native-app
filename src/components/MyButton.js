import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'


const MyButton = ({
  title = "",
  onPress = () => { },
  invert = false,
  isLoading = false,
  style = {},
  textStyle = {},
  leftIcon = null,

}) => {
  return (
    <TouchableOpacity
      style={[invert ? __MyButtonStyles.rootInvertView : __MyButtonStyles.rootView, style]}
      onPress={onPress}>
      {!!leftIcon &&
        <View style={__MyButtonStyles.iconView}>
          {typeof (leftIcon) == "function" ? leftIcon() :
            <Image source={leftIcon} style={{ height: 17, width: 17, tintColor: colors.primary }} />}
        </View>}
      <Text style={[invert ? __MyButtonStyles.invertTitleText : __MyButtonStyles.titleText, textStyle]}>{title}</Text>
      {!!leftIcon &&
        <View style={__MyButtonStyles.iconView} />}
    </TouchableOpacity>
  )
}


const TransparentButton = ({
  title = "",
  onPress = () => { },

}) => {
  return (
    <TouchableHighlight
    style={{borderRadius: 10}}
      underlayColor={colors.lightPrimary2}
      onPress={onPress}>
      <View style={__tarsparentButtonStyle.root} >
        <Text style={__tarsparentButtonStyle.text} >{title}</Text>
      </View>
    </TouchableHighlight>
  )
}

export { MyButton, TransparentButton }

const __MyButtonStyles = StyleSheet.create({
  rootView: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  iconView: {
    height: 50, aspectRatio: 1, alignItems: "center", justifyContent: "center",
  },
  titleText: {
    color: colors.text,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    fontSize: 16,
    textTransform: "uppercase"
  },
  rootInvertView: {
    height: 50,
    backgroundColor: colors.darkSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  invertTitleText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    includeFontPadding: false,
    fontSize: 16,
    textTransform: "uppercase"
  }
})

const __tarsparentButtonStyle = StyleSheet.create({
  root: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    
  },
  text: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.regular,
    includeFontPadding: false
  }
})