
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import ReportScreen from '../../screens/MonthlyReport/ReportScreen'





const MonthlyReportStack = createNativeStackNavigator()

const StackMonthReport = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <MonthlyReportStack.Navigator
        screenOptions={{ headerShown: false }}>
        <MonthlyReportStack.Screen initialParams={route.params} name={routes.monthyReportScreen} component={ReportScreen} />
        
        
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <MonthlyReportStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </MonthlyReportStack.Navigator>
    </View>
  )
}
export default StackMonthReport