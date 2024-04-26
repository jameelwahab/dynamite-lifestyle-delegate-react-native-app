
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Complete from '../../screens/GoalStatement/Completed'
import GoalstatmentDetail from '../../screens/GoalStatement/GoalstatmentDetail'







const GoalStatementCompletedStack = createNativeStackNavigator()

const StackGoalStatementCompleted = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <GoalStatementCompletedStack.Navigator
        screenOptions={{ headerShown: false }}>
        <GoalStatementCompletedStack.Screen initialParams={route.params}
          name={routes.goalStatementCompleteScreen} component={Complete} />
        <GoalStatementCompletedStack.Screen name={routes.goalStatmentDetail} component={GoalstatmentDetail} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <GoalStatementCompletedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </GoalStatementCompletedStack.Navigator>
    </View>
  )
}
export default StackGoalStatementCompleted