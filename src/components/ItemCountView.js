import { View, Text, Image } from 'react-native'
import React from 'react'
import MyText from './MyText'
import { textSize } from '../utilities/styles'
import {colors} from '../utilities/colors'

const ItemCountView = ({ icon, text1 = "", text2 = "", img, noTint = false, backgroundColor = colors.gray14, text1Color = colors.white, mb = 5, ph = 10 }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor, paddingHorizontal: ph, paddingVertical: 6, borderRadius: 900, marginBottom: mb }}>
        {!!icon && icon }
	{img && <Image resizeMode="contain" source={img} style={{ height: 15, width: 15, marginRight: 10, }} />}
        <MyText type='M' color={text1Color} >{text1}</MyText>
      </View>
      {!!text2 &&
        <MyText fontSize={textSize.description} type='M' color={colors.silver} >{text2}</MyText>
      }
    </View>

  )
}

export default ItemCountView
