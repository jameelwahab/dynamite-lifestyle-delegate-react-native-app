
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import GoalstatmentDetail from '../../screens/GoalStatement/GoalstatmentDetail'
import Incomplete from '../../screens/GoalStatement/Incomplete'







const GoalStatementIncompletedStack= createNativeStackNavigator()

const StackGoalStatementIncompleted = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <GoalStatementIncompletedStack.Navigator
        screenOptions={{ headerShown: false }}>
        <GoalStatementIncompletedStack.Screen initialParams={route.params}
          name={routes.goalStatementIncompleteScreen} component={Incomplete} />
        <GoalStatementIncompletedStack.Screen name={routes.goalStatmentDetail} component={GoalstatmentDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <GoalStatementIncompletedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </GoalStatementIncompletedStack.Navigator>
    </View>
  )
}
export default StackGoalStatementIncompleted
