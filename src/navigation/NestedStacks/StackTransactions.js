import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from '../routes';
import Transactions from '../../screens/Payments/Transactions';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';

const TransactionStack = createNativeStackNavigator();
const StackTransactions = ({route}) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
    <TransactionStack.Navigator
      initialRouteName={routes.transactionScreen}
      screenOptions={{ headerShown: false }}>
      <TransactionStack.Screen initialParams={route.params} name={routes.transactionScreen} component={Transactions} />
      {/*//? Default Screens Start */}
      {defaultScreens.map((x, i) => (
        <TransactionStack.Screen key={x.name} name={x.name} component={x.component} />
      ))}
      {/*//? Default Screens End */}
    </TransactionStack.Navigator>
  </View>
  )
}

export default StackTransactions