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
  leftIcon = null,
  rightIcon = null,
  rightIconOnPress = () => { },
  noSpace = false,
}) => {
  const [isFocused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View style={{ marginBottom: noSpace ? 0 : 15 }}>
      <Text style={[__MyInputStyles.labelText, isFocused ? __MyInputStyles.focusedLabelText : undefined]}>{label}</Text>
      <View style={[__MyInputStyles.inputView, multiline ? __MyInputStyles.multilineView : undefined, isFocused ? __MyInputStyles.focusedView : undefined]}>
        {!!leftIcon && <View style={[__MyInputStyles.leftButton]} >{leftIcon()}</View>}
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[__MyInputStyles.input, multiline ? __MyInputStyles.multilineView : undefined, !!rightIcon && { paddingLeft: 0 }]}
          value={value}
          onChangeText={onChangeText}
          scrollEnabled={multiline}
          keyboardAppearance="dark"
          keyboardType={keyboardType}
          // keyboardType="numeric"
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
        {isPassword ?
          <TouchableHighlight
            onPress={() => setShowPassword(!showPassword)}
            style={__MyInputStyles.eyeButton}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} color={colors.primary} size={25} />
            {/* <Image style={__MyInputStyles.eyeIcon} source={showPassword ? openEye : closeEye} /> */}
          </TouchableHighlight> :
          rightIcon &&
          <TouchableHighlight
            onPress={rightIconOnPress}
            style={[__MyInputStyles.rightButton, { marginRight: 0 }]}>
            {rightIcon()}
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
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 5
  },

  leftButton: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    // marginRight: -5
    // backgroundColor:"pink"
  },
  rightButton: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    // marginLeft: 5,
    marginRight: -5
    // backgroundColor:"pink"
  },

  eyeIcon: {
    height: 25,
    width: 25,
    tintColor: colors.disableText
  }
})