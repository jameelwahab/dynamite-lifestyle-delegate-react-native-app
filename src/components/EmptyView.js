import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../utilities/icons'
import MyText from './MyText'

const EmptyView = ({ label }) => {
  return (
    <View style={{ alignItems: "center", flex: 1, justifyContent: "center", }} >
      <View style={{ height: 250, width: 250, alignItems: "center", justifyContent: "center" }}>
        <Image source={icons.emptyBox} style={{ height: 90, width: 90 }} />
        <MyText style={{ marginTop: 5, textAlign: "center" }} >{!!label ? label : "No Data Found"}</MyText>
      </View>
    </View>
  )
}

export default EmptyView