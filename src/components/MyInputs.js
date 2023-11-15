import { View, Text, TextInput, StyleSheet, TouchableHighlight, Image, Platform } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '../utilities/fonts'
import { colors } from '../utilities/colors'
// import { closeEye, openEye } from '../utilities/icons'
import Ionicons from 'react-native-vector-icons/Ionicons';




const MyInputs = ({
  label = "",
  placeholder = "",
  value = "",
  onChangeText,
  keyboardType = "default",
  isPassword = false,
  multiline = false,
  maxLength = isPassword ? 24 : !!maxLength ? maxLength : undefined,
  rightIcon = null,
}) => {
  const [isFocused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={[__MyInputStyles.labelText, isFocused ? __MyInputStyles.focusedLabelText : undefined]}>{label}</Text>
      <View style={[__MyInputStyles.inputView, multiline ? __MyInputStyles.multilineView : undefined, isFocused ? __MyInputStyles.focusedView : undefined]}>
        {!!rightIcon && <View style={__MyInputStyles.eyeButton} >{rightIcon()}</View>}
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[__MyInputStyles.input, multiline ? __MyInputStyles.multilineView : undefined, !!rightIcon && { paddingLeft: 0 }]}
          value={value}
          onChangeText={onChangeText}
          scrollEnabled={multiline}
          keyboardAppearance="dark"
          keyboardType={keyboardType}
          selectionColor={colors.selection}
          autoCorrect={false}
          multiline={multiline}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword ? !showPassword : false}
          textAlignVertical={multiline ? "top" : "center"}
          autoCapitalize="none"
        />
        {isPassword &&
          <TouchableHighlight
            onPress={() => setShowPassword(!showPassword)}
            style={__MyInputStyles.eyeButton}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} color={colors.primary} size={25} />
            {/* <Image style={__MyInputStyles.eyeIcon} source={showPassword ? openEye : closeEye} /> */}
          </TouchableHighlight>
        }
      </View>
    </View>
  )
}

export default MyInputs

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
  eyeIcon: {
    height: 25,
    width: 25,
    tintColor: colors.disableText
  }
})