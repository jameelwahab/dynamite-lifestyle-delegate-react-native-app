import { View, Text, Pressable, Platform } from 'react-native'
import React from 'react'
import CheckBox from '@react-native-community/checkbox'
import MyText from './MyText'
import { colors } from '../utilities/colors'

const MyCheckBox = ({ value, title = "", onPress, circle = false, size = 20, color = colors.primary, textColor = colors.white, row = true, pb = 10, isNormalText = false }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: row ? "row" : "column",
        alignItems: "center",
        paddingLeft: 1,
        paddingBottom: pb,
      }}>
      {(Platform.OS == "android" && circle) ?
        <View
          style={{
            height: size,
            width: size,
            borderRadius: size / 2,
            borderColor: color,
            borderWidth: 2,
            marginLeft: 6,
            alignItems: "center",
            justifyContent: "center"
          }}>
          {value &&
            <View
              style={{
                height: size - 12,
                width: size - 12,
                borderRadius: (size - 12) / 2,
                backgroundColor: color,
              }} />}

        </View>
        :
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
        />}
      {!!title &&
        <View style={{
          marginLeft: row ? Platform.OS == "ios" ? 10 :
            (Platform.OS == "android" && circle) ? 14 :
              20 : 0, flex: row ? 1 : undefined, marginTop: row ? 0 : 5
        }}>
          <MyText color={textColor} capitalize={!isNormalText}  >{title}</MyText>
        </View>}

    </Pressable>
  )
}

export default MyCheckBox