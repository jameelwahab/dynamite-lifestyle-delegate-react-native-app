
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Filter from '../../screens/DelegateReport/Filter'
import MainScreen from '../../screens/DelegateReport/MainScreen'
import DelegateMonthlyReport from '../../screens/DelegateReport/DelegateMonthlyReport'
import BookingDelegate from '../../screens/DelegateReport/BookingDelegate'
import AccountablityTracker from '../../screens/DelegateReport/MainScreen/AccountablityTracker'
import SalesPerformanceDelegate from '../../screens/DelegateReport/SalesPerformanceDelegate'
import SaleFilter from '../../screens/DelegateReport/SalesPerformanceDelegate/SaleFilter'







const DelegateReportStack = createNativeStackNavigator()

const StackDelegateReport = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DelegateReportStack.Navigator
        screenOptions={{ headerShown: false }}>
        <DelegateReportStack.Screen initialParams={route.params} name={routes.delegateReportScreen} component={MainScreen} />
        <DelegateReportStack.Screen name={routes.delegateReportFilterScreen} component={Filter} />
        <DelegateReportStack.Screen name={routes.delegeteMonthlyReportScreen} component={DelegateMonthlyReport} />

        <DelegateReportStack.Screen name={routes.delegateReportBookingsScreen} component={BookingDelegate} />
        <DelegateReportStack.Screen name={routes.delegateReportAccountablityTrackerScreen} component={AccountablityTracker} />
        <DelegateReportStack.Screen name={routes.delegateReportSalesScreen} component={SalesPerformanceDelegate} />
        <DelegateReportStack.Screen name={routes.delegateReportSalesFilterScreen} component={SaleFilter} />

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