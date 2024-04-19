import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import Listing from './component/Listing'

const BookCallPods = ({ navigation, route }) => {

  return (
    <RootView hideSubHeader >
      <Listing
        navigation={navigation}
        route={route}
      />
    </RootView>
  )
}

export default BookCallPods