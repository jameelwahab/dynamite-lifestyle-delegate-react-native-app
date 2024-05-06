
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import PerformanceStreak from '../../screens/DailyStreakPerformance/PerformanceStreak'
import StreakAnalysis from '../../screens/DailyStreakPerformance/StreakAnalysis'
import Filter from '../../screens/DailyStreakPerformance/Filter'





const PerformanceStack = createNativeStackNavigator()

const StackDailyStreakPerformance = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <PerformanceStack.Navigator
        screenOptions={{ headerShown: false }}>
        <PerformanceStack.Screen initialParams={route.params} name={routes.performanceStreakScreen} component={PerformanceStreak} />
        <PerformanceStack.Screen name={routes.performanceAnalysisScreen} component={StreakAnalysis} />
        <PerformanceStack.Screen name={routes.performanceAnalysisFilterScreen} component={Filter} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <PerformanceStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </PerformanceStack.Navigator>
    </View>
  )
}
export default StackDailyStreakPerformance