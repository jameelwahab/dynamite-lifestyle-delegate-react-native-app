import { View, Text, Pressable, Platform } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'
import MyText from './MyText'
import { colors } from '../utilities/colors'

const MyCheckBox = ({ value, title = "", onPress, circle = false, size = 20, color = colors.primary, textColor = colors.white, row = true,  }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: row ? "row" : "column",
        alignItems: "center",
        paddingLeft: 1,
        paddingBottom: 10,
      }}>
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
        animationDuration={0}
      />
      {!!title &&
        <View style={{ marginLeft: row ? Platform.OS == "ios" ? 10 : 20 : 0, flex: row ? 1 : undefined, marginTop: row ? 0 : 5 }}>
          <MyText color={textColor} capitalize  >{title}</MyText>
        </View>}

    </Pressable>
  )
}

export default MyCheckBox