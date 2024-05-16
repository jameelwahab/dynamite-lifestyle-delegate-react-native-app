
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Filter from '../../screens/DelegateReport/Filter'
import MainScreen from '../../screens/DelegateReport'







const DelegateReportStack = createNativeStackNavigator()

const StackDelegateReport = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DelegateReportStack.Navigator
        screenOptions={{ headerShown: false }}>
        <DelegateReportStack.Screen initialParams={route.params} name={routes.delegateReportScreen} component={MainScreen} />
        <DelegateReportStack.Screen name={routes.delegateReportFilterScreen} component={Filter} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <DelegateReportStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </DelegateReportStack.Navigator>
    </View>
  )
}
export default StackDelegateReport