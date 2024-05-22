
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import PendingCommission from '../../screens/Sales/PendingCommission'







const PendingCommissionStack = createNativeStackNavigator()

const StackSalesPendingCommission = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <PendingCommissionStack.Navigator
        screenOptions={{ headerShown: false }}>
        <PendingCommissionStack.Screen initialParams={route.params} name={routes.salePendingCommissionScreen} component={PendingCommission} />
        
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <PendingCommissionStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </PendingCommissionStack.Navigator>
    </View>
  )
}
export default StackSalesPendingCommission