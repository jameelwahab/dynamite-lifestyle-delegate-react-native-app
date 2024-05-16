import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { icons } from '../utilities/icons'
import { colors } from '../utilities/colors'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../utilities/fonts'

const TitleView = ({
  onBackButtonPress,
  title,
  subTitle,
  titleView,
  hideBackBottomButton = false,
}) => {
  const navigation = useNavigation()
  return (
    <View style={__header.secondView}>
      {!hideBackBottomButton &&
        <Pressable onPress={!!onBackButtonPress ? onBackButtonPress : () => navigation.goBack()}
          style={__header.leftButtonView}>
          {icons.backMajor(colors.primary, 25)}
        </Pressable>}
      {
        !!title ?
          <View style={__header.titleView}>
            <Text style={__header.titleText}>{<Text style={__header.titleText}>{title}</Text>
            }</Text>

            {!!subTitle && <Text style={__header.subTitle}>{subTitle}</Text>}
          </View>

          :
          <View style={{ flex: 1 }}>
            {titleView?.()}
          </View>
      }
    </View >
  )
}

export default TitleView

const __header = StyleSheet.create({
  secondView: {
    height: 40,
    width: "100%",
    // backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -10,
    flex:1
  },
  titleView: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 15
  },
  titleText: {
    color: colors.primary,
    // fontFamily: fonts.semiBold,
    fontSize: 18,
    includeFontPadding: false,
    textTransform: "capitalize",
    fontFamily: fonts.bold,
    includeFontPadding: false
  },
  subTitle: {
    fontSize: 10,
    color: colors.lightText2,
    fontFamily: fonts.medium,
    includeFontPadding: false,
    marginTop:3
  },
  leftButtonView: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
})