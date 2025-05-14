import { View, Text } from 'react-native'
import React from 'react'
import ListForAllTypes from '../SelfImage/components/ListForAllTypes'

const Completed = (props) => {
  return (
    <ListForAllTypes type2="goal_statment" {...props} />
  )
}

export default Completed