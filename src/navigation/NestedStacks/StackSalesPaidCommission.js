
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import PaidCommission from '../../screens/Sales/PaidCommission'







const PaidCommissionStack = createNativeStackNavigator()

const StackSalesPaidCommission = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <PaidCommissionStack.Navigator
        screenOptions={{ headerShown: false }}>
          
        <PaidCommissionStack.Screen initialParams={route.params} name={routes.salePidCommissionScreen} component={PaidCommission} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <PaidCommissionStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </PaidCommissionStack.Navigator>
    </View>
  )
}
export default StackSalesPaidCommission