import { View, Text } from 'react-native'
import React from 'react'
import GoalStatementList from './components/GoalStatementList'


const Completed = (props) => {
  return (
    <GoalStatementList {...props} />
  )
}

export default Completed