import { View, Text } from 'react-native'
import React from 'react'
import List from './List'

const RepliesView = ({ list, navigation, loader, refresh, type }) => {
  return (
    <List
      type={type}
      list={list}
      navigation={navigation}
      loader={loader}
      refresh={refresh}
    />
  )
}

export default RepliesView