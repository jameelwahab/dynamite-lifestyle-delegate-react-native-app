
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import GoalstatmentDetail from '../../screens/GoalStatement/GoalstatmentDetail'
import Responded from '../../screens/GoalStatement/Responded'
import SelfImageDetail from '../../screens/SelfImage/Detail'







const GoalStatementRespondedStack = createNativeStackNavigator()

const StackGoalStatementResponded = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <GoalStatementRespondedStack.Navigator
        screenOptions={{ headerShown: false }}>
        <GoalStatementRespondedStack.Screen initialParams={route.params}
          name={routes.goalStatementResponedScreen} component={Responded} />
        <GoalStatementRespondedStack.Screen name={routes.goalStatmentDetail} component={GoalstatmentDetail} />
        <GoalStatementRespondedStack.Screen name={routes.selfImageDetail} component={SelfImageDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <GoalStatementRespondedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </GoalStatementRespondedStack.Navigator>
    </View>
  )
}
export default StackGoalStatementResponded
