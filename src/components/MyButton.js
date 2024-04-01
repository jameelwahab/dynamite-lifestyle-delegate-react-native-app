import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'
import { icons } from '../utilities/icons'


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
  icon = () => { },
  onPress = () => { },
}) => {
  return (
    <TouchableHighlight
      style={{ borderRadius: 10, }}
      underlayColor={colors.lightPrimary2}
      onPress={onPress}>
      <View style={__tarsparentButtonStyle.root} >
        {icon?.()}
        {!!title && <Text style={__tarsparentButtonStyle.text} >{title}</Text>}
      </View>
    </TouchableHighlight>
  )
}

const MenuButton = ({ size = 25, onPress = () => { }, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
      style={[{
        height: size, width: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center",
        backgroundColor: colors.lightPrimary3,
        marginHorizontal: 5,
      }, style]}

    >
      {icons.threeDots(colors.primary, size - 10)}
    </TouchableOpacity>
  )
}

export { MyButton, TransparentButton, MenuButton }

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
    height: 50, aspectRatio: 1, alignItems: "center", justifyContent: "center",
  },
  titleText: {
    color: colors.black,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    fontSize: 16,
    textTransform: "uppercase"
  },
  _rootInvertView: {
    height: 45,
    backgroundColor: colors.darkSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  get rootInvertView() {
    return this._rootInvertView
  },
  set rootInvertView(value) {
    this._rootInvertView = value
  },
  invertTitleText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    fontSize: 16,
    textTransform: "uppercase"
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