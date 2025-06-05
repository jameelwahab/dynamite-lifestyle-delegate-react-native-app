import { View, Text } from 'react-native'
import React from 'react'
import { fonts } from '../utilities/fonts'
import { colors } from '../utilities/colors'

const MyText = ({
  children,
  onPress,
  type = "regular",
  fontSize = 14,
  color = colors.text,
  align = "left",
  underlined = false,
  style,
  isLabel = false,
  capitalize = false,
  uppercase = false,
  isHeading = false,
  isItalic = false,
  ...props
}) => {
  return (
    <Text
      onPress={onPress}
      style={[{
        fontFamily: type == "i" ? fonts.italic : type == "bold" ? fonts.bold : type == "medium" ? fonts.medium : type == "semi" ? fonts.semiBold : type == "light" ? fonts.light : fonts.regular,
        includeFontPadding: false,
        fontSize,
        color,
        textAlign: align,
        textTransform: capitalize ? "capitalize" : uppercase ? "uppercase" : "none",

      },
      isHeading && {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.primary
      },
        style,
      underlined && {
        textDecorationLine: "underline",
        textDecorationColor: colors.primary,
      }, isLabel && {
        fontFamily: fonts.regular,
        includeFontPadding: false,
        color: colors.lightText,
        marginBottom: 5,
        marginLeft: 2,

      }]}

      {...props}
    >{children}</Text>
  )
}

export default MyText
