
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import Dasboard from '../../screens/Dashboard'
import FilterScreen from '../../screens/Dashboard/FilterScreen'



const DashboardStack = createNativeStackNavigator()

const StackMissionControl = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DashboardStack.Navigator
        initialRouteName={routes.missionControlScreen}
        screenOptions={{ headerShown: false }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <DashboardStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
        <DashboardStack.Screen name={routes.missionControlScreen} component={Dasboard} />
        <DashboardStack.Screen name={routes.missionControlfilterScreen} component={FilterScreen} />


      </DashboardStack.Navigator>
    </View>
  )
}
export default StackMissionControl