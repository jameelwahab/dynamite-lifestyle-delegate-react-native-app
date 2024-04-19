import { View, Text, TextInput, StyleSheet, TouchableHighlight, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '../utilities/fonts'
import { colors } from '../utilities/colors'
import { closeEye, icons, openEye } from '../utilities/icons'
import MyText from './MyText'

const MyTouchableInput = ({
  label = "",
  placeholder = "",
  value,
  onPress,
  icon = icons.down,
  noSpace = false,
  view = null,
  iconOnPress,
  subTextView,
  clearbutton,
  onClearButtonPress = () => { },
  disabled = false,
  error = false
}) => {
  const [isFocused, setFocused] = useState(false)
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      opacity={disabled ? 0.6 : 1}
      style={{ marginBottom: noSpace ? 0 : 15 }}>
      <View pointerEvents={disabled ? "none" : "auto"} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text pointerEvents={!!iconOnPress ? "auto" : "none"} style={[__MyInputStyles.labelText, isFocused ? __MyInputStyles.focusedLabelText : undefined, error ? __MyInputStyles.TextError : undefined,]}>{label}</Text>
        {!!clearbutton && !disabled ?
          <Pressable
            style={__MyInputStyles.clearbtnView}
            onPress={onClearButtonPress}>
            <MyText color={colors.primary} >Clear</MyText>
          </Pressable> :
          !!subTextView ? subTextView() : <View />}
      </View>
      <View pointerEvents={!!iconOnPress ? "auto" : "none"} style={[__MyInputStyles.inputView, isFocused ? __MyInputStyles.focusedView : undefined, error ? __MyInputStyles.borderError : undefined, !!view && { height: null, }]}>
        {!!view ? view() :
          <TextInput
            pointerEvents="none"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={[__MyInputStyles.input, !!view && { height: undefined },]}
            value={value}
            keyboardAppearance="dark"
            selectionColor={colors.text}
            autoCorrect={false}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            textAlignVertical={"center"}
            editable={false}
          />}
        {!disabled &&
          <Pressable onPress={iconOnPress}
            style={{ paddingHorizontal: 10, height: 45, justifyContent: "center" }}>
            {icon()}
          </Pressable>}
      </View>

    </Pressable>
  )
}

export default MyTouchableInput

const __MyInputStyles = StyleSheet.create({
  rootView: {},
  inputView: {
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: colors.lightGrey
  },
  multilineView: {
    height: 100,
  },
  labelText: {
    fontFamily: fonts.regular,
    includeFontPadding: false,
    color: colors.lightText,
    marginBottom: 5,
    marginLeft: 2,
  },
  focusedLabelText: {
    color: colors.primary,
  },
  input: {
    height: 45,
    fontFamily: fonts.regular,
    includeFontPadding: false,
    flex: 1,
    paddingHorizontal: 10,
    color: colors.text,
  },
  focusedView: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  eyeButton: {
    height: 40,
    width: 40,
    borderRadius: 45 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 5
  },
  borderError:{
    borderColor:colors.delete
  },
  TextError:{
    color:colors.delete
  },
  eyeIcon: {
    height: 25,
    width: 25,
    tintColor: colors.disableText
  },
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },
})