import { View, Text, Image } from 'react-native'
import React from 'react'
import { emptyBox } from '../utilities/icons'
import MyText from './MyText'

const EmptyView = ({ label }) => {
  return (
    <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }} >
      <Image source={emptyBox} style={{ height: 100, width: 100 }} />
      <MyText style={{ marginTop: 5,textAlign:"center" }} >{!!label ? label : "No Data Found"}</MyText>
    </View>
  )
}

export default EmptyView