import { View, Text } from 'react-native'
import React from 'react'
import RootView from '../../components/RootView'
import FeedTabs from './FeedTabs'
import FeedScreen from './FeedScreen'

const Feed = (props) => {
  return (
    <RootView hideSubHeader>
      {/* <FeedTabs/> */}
      
      <FeedScreen  {...props} />
    </RootView>
  )
}

export default Feed


