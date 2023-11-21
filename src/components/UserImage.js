import { View, Text } from 'react-native'
import React from 'react'
import MyImage from './MyImage'
import MyText from './MyText'
import { S3_URL } from '../utilities/constants'
import { colors } from '../utilities/colors'

const UserImage = ({ image, name, size = 40 }) => {
  return (
    <View style={{ height: size, width: size, borderRadius: size / 2, overflow: "hidden", borderWidth: 1 / 4, borderColor: colors.primary }}>
      {!!image ?
        <MyImage
          source={{ uri: S3_URL + image }}
          style={{ height: "100%", width: '100%' }} />
        :
        <MyText>
          {name?.at(0)?.toUpperCase()}
        </MyText>
      }
    </View>
  )
}

export default UserImage