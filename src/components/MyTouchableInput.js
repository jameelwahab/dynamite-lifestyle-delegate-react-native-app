import { View, Text, TextInput, StyleSheet, TouchableHighlight, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '../utilities/fonts'
import { colors } from '../utilities/colors'
import { closeEye, icons, openEye } from '../utilities/icons'

const MyTouchableInput = ({
  label = "",
  placeholder = "",
  value,
  onPress,
  icon = icons.down,
  noSpace = false
}) => {
  const [isFocused, setFocused] = useState(false)
  return (
    <Pressable
      onPress={onPress}
      style={{ marginBottom: noSpace ? 0 : 15 }}>
      <Text pointerEvents="none" style={[__MyInputStyles.labelText, isFocused ? __MyInputStyles.focusedLabelText : undefined]}>{label}</Text>
      <View pointerEvents="none" style={[__MyInputStyles.inputView, isFocused ? __MyInputStyles.focusedView : undefined]}>
        <TextInput
          pointerEvents="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[__MyInputStyles.input]}
          value={value}
          keyboardAppearance="dark"
          selectionColor={colors.text}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          textAlignVertical={"center"}
          editable={false}
        />
        <View style={{ paddingHorizontal: 10 }}>
          {icon()}
        </View>
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
    color: colors.text
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
  eyeIcon: {
    height: 25,
    width: 25,
    tintColor: colors.disableText
  }
})