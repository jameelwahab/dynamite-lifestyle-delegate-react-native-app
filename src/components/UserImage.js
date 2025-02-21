import { View, Text } from 'react-native'
import React from 'react'
import MyImage from './MyImage'
import MyText from './MyText'
import { S3_URL } from '../utilities/constants'
import { colors } from '../utilities/colors'

const UserImage = ({ image, name, size = 40, backgroundTransparent = false, noS3 = false, borderWidth = 1 / 4, borderColor = colors.primary }) => {
  return (
    <View style={{ height: size, width: size, borderRadius: size / 2, overflow: "hidden", borderWidth: borderWidth, borderColor: borderColor, alignItems: "center", justifyContent: "center", backgroundColor: backgroundTransparent ? "#00000000" : colors.grey }}>
      {!!image ?
        <MyImage
          source={{ uri: noS3 ? image : S3_URL + image }}
          style={{ height: "100%", width: '100%' }} />
        :
        <MyText color={colors.white}>
          {!!name ? name.charAt(0).toUpperCase() : 'N/A'}
        </MyText>
      }
    </View>
  )
}

export default UserImage
