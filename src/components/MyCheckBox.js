import { View, Text, Pressable } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'
import MyText from './MyText'
import { colors } from '../utilities/colors'

const MyCheckBox = ({ value, title = "", onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", paddingLeft: 1, paddingBottom: 10 }}>
      <CheckBox
        onAnimationType="bounce"
        offAnimationType="bounce"
        onFillColor={colors.primary}
        onTintColor={colors.primary}
        onCheckColor={colors.black}
        tintColor={colors.primary}
        lineWidth={2}
        boxType="square"
        disabled={true}
        style={{ height: 20, width: 20, }}
        tintColors={{ true: colors.primary, false: colors.primary }}
        value={value}
      />
      <MyText style={{ marginLeft: 10 }} >{title}</MyText>

    </Pressable>
  )
}

export default MyCheckBox