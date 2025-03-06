import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'
import { icons } from '../utilities/icons'
import  MyText from './MyText'
import { textSize } from '../utilities/styles'


const MyButton = ({
  title = "",
  onPress = () => { },
  invert = false,
  isLoading = false,
  style = {},
  textStyle = {},
  leftIcon = null,
  noSpace = false,
  noCapitalize = false,
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
      <Text style={[invert ? __MyButtonStyles.invertTitleText : __MyButtonStyles.titleText, textStyle,
      { textTransform: noCapitalize ? "none" : "uppercase" },
      { letterSpacing: 0.5 }
      ]}>{title}</Text>
      {!!leftIcon && noSpace == false &&
        <View style={__MyButtonStyles.iconView} />}
    </TouchableOpacity>
  )
}


const MyClearButton = ({
  title = "",
  onPress = () => { },
  style = {},
  textStyle = {},
  leftIcon = null,
  noSpace = false,
  noCapitalize = false,
}) => {
  return (
    <TouchableOpacity
      style={[__MyButtonStyles.rootInvertView, style]}
      onPress={onPress}>
      {!!leftIcon &&
        <View style={__MyButtonStyles.iconView}>
          {typeof (leftIcon) == "function" ? leftIcon() :
            <Image source={leftIcon} style={{ height: 17, width: 17, tintColor: colors.primary }} />}
        </View>}
      <Text style={[__MyButtonStyles.invertTitleText, textStyle,
      { textTransform: noCapitalize ? "none" : "uppercase" }
      ]}>{title}</Text>
      {!!leftIcon && noSpace == false &&
        <View style={__MyButtonStyles.iconView} />}
    </TouchableOpacity>
  )
}

const MyButton2 = ({
  title = "",
  icon = () => { },
  onPress = () => { },
  style = {},
  color = colors.lightPrimary2
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}>
      <View style={{backgroundColor:color,paddingHorizontal:7, paddingVertical:7, borderRadius:30,}} >
        {icon?.()}
        {!!title && <MyText color={colors.primary}  fontSize={textSize.mini}>{title}</MyText>}
      </View>
    </TouchableOpacity>
  )
}

const TransparentButton = ({
  title = "",
  icon = () => { },
  onPress = () => { },
  style = {},
  underlayColor = colors.lightPrimary2
}) => {
  return (
    <TouchableHighlight
      style={{ borderRadius: 10, }}
      underlayColor={underlayColor}
      onPress={onPress}>
      <View style={[__tarsparentButtonStyle.root, style]} >
        {icon?.()}
        {!!title && <Text style={__tarsparentButtonStyle.text} >{title}</Text>}
      </View>
    </TouchableHighlight>
  )
}

const MenuButton = ({ backgroundColor = colors.lightPrimary3, marginHorizontal, size = 25, onPress = () => { }, style, touchgap = 15 }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: touchgap, left: touchgap, right: touchgap, bottom: touchgap }}
      style={[{
        height: size, width: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center",
        backgroundColor: backgroundColor,
        marginHorizontal: marginHorizontal,
      }, style]}

    >
      {icons.threeDots(colors.primary, size - 10)}
    </TouchableOpacity>
  )
}

export { MyButton, MyButton2, TransparentButton, MenuButton, MyClearButton }



const __MyButtonStyles = StyleSheet.create({
  rootView: {
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  iconView: {
    // height: 15,
    // aspectRatio: 1,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: colors.black,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    fontSize: 16,
    textTransform: "uppercase"
  },
  rootInvertView: {
    height: 45,
    backgroundColor: colors.darkSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  // get rootInvertView() {
  //   return this._rootInvertView
  // },
  // set rootInvertView(value) {
  //   this._rootInvertView = value
  // },
  invertTitleText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    fontSize: 16,

  }
})

const __tarsparentButtonStyle = StyleSheet.create({
  root: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.regular,
    includeFontPadding: false,
    marginLeft: 5
  }
})
