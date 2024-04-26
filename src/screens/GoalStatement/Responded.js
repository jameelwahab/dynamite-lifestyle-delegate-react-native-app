import { View, Text } from 'react-native'
import React from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import GoalStatementList from './components/GoalStatementList'

const Responded = (props) => {
  return (
    <GoalStatementList {...props} />
  )
}

export default Responded