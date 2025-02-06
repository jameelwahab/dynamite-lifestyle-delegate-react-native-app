import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import MyText from './MyText'
import { colors } from '../utilities/colors'
import { fonts } from '../utilities/fonts'
import ParsedText from 'react-native-parsed-text';


const CollapsibleText = ({ style, children }) => {
  const [showFull, setShowFull] = useState(false)
  if (Platform.OS == "android") {
    return (
      <MyText fontSize={13} dataDetectorType="all" userSelect={"all"} selectable={true} style={style}>
        <MyText numberofLines={2}>
	    {showFull ? children : children.slice(0,40) }
        </MyText>
        {children.length > 150 && (
          <MyText
            onPress={() => setShowFull(!showFull)}
            style={{ color: colors.primary, fontSize: 14, includeFontPadding: false, fontFamily: fonts.medium, marginLeft: -5, }} >
            {showFull ? " See Less" : " See More"}
          </MyText>
        )}
      </MyText>
    )
  }
  else if (Platform.OS == "ios") {
    return (
      <View>
        <TextInput
          keyboardAppearance='dark'
          editable={false}
          multiline={true}
          style={{
            fontFamily: fonts.regular,
            includeFontPadding: false,
            color: colors.text,
            margin: 0,
            padding: 0,
            fontSize: 13
          }}
          value={children.length < 150 ? children : showFull ? children : children.slice(0, 150) + "..."}
          dataDetectorTypes={"all"}
          scrollEnabled={false}
        >
        </TextInput>
        {children.length > 150 && (
          <MyText
            onPress={() => setShowFull(!showFull)}
            style={{ color: colors.primary, fontSize: 14, includeFontPadding: false, fontFamily: fonts.regular, marginLeft: -5 }} >
            {showFull ? " See Less" : " See More"}
          </MyText>
        )}
      </View>
    )
  }


}

export default CollapsibleText
