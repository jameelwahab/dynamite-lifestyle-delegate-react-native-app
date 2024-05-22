
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import LinksList from '../../screens/Links/LinksList'
import Transactionlist from '../../screens/Sales/SaleTransactions/Transactionlist'
import TransactionAddEdit from '../../screens/Sales/SaleTransactions/TransactionAddEdit'





const SalesTeamTransactionStack = createNativeStackNavigator()

const StackSalesTeamTransaction = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SalesTeamTransactionStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SalesTeamTransactionStack.Screen initialParams={route.params} name={routes.salesTeamTransactionsListingScreen} component={Transactionlist} />
        <SalesTeamTransactionStack.Screen name={routes.salesTeamTransactionsAddEditScreen} component={TransactionAddEdit} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SalesTeamTransactionStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SalesTeamTransactionStack.Navigator>
    </View>
  )
}
export default StackSalesTeamTransaction