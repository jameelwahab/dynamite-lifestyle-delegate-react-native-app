import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'

const DataDetectorText = ({ style, children }) => {

  if (Platform.OS == "android") {
    return (
      <MyText fontSize={13} dataDetectorType="all" userSelect={"all"} selectable={true} style={style}>
        <MyText >
          {children}
        </MyText>
      </MyText>
    )
  }
  else if (Platform.OS == "ios") {
    return (
      <TextInput
        keyboardAppearance='dark'
        editable={false}
        multiline={true}
        style={[{
          fontFamily: fonts.regular,
          includeFontPadding: false,
          color: colors.text,
          margin: 0,
          padding: 0,
          fontSize: 13,
        }, style]}
        value={children}
        dataDetectorTypes={"all"}
        scrollEnabled={false}
      />
    )
  }


}

export default DataDetectorText
