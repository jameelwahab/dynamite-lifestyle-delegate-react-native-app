import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import Listing from './component/Listing'

const SourcePod = ({ navigation, route }) => {

  return (
    <RootView hideSubHeader>
      <Listing
        navigation={navigation}
        route={route}
      />
    </RootView>
  )
}

export default SourcePod