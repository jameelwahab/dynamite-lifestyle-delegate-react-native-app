import { View, Text, Pressable } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'
import MyText from './MyText'
import { colors } from '../utilities/colors'

const MyCheckBox = ({ value, title = "", onPress, circle = false, size = 20, color = colors.primary, textColor = colors.white }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", paddingLeft: 1, paddingBottom: 10 }}>
      <CheckBox
        onAnimationType="bounce"
        offAnimationType="bounce"
        onFillColor={color}
        onTintColor={color}
        onCheckColor={colors.black}
        tintColor={color}
        lineWidth={2}
        boxType={circle ? "circle" : "square"}
        disabled={true}
        style={{ height: size, width: size, }}
        tintColors={{ true: color, false: color }}
        value={value}
      />
      <MyText color={textColor} style={{ marginLeft: 10 }} >{title}</MyText>

    </Pressable>
  )
}

export default MyCheckBox