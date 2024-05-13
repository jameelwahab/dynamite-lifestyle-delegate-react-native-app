
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import LinksList from '../../screens/Links/LinksList'
import AccountabilityTrackerScreen from '../../screens/AccountabilityTracker/AccountabilityTrackerScreen'
import PastActivities from '../../screens/AccountabilityTracker/PastActivities'





const AcountabilityTrackerStack = createNativeStackNavigator()

const StackAcountabilityTracker = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <AcountabilityTrackerStack.Navigator
        screenOptions={{ headerShown: false }}>
        <AcountabilityTrackerStack.Screen initialParams={route.params} name={routes.accountabilityTrackerScreen} component={AccountabilityTrackerScreen} />
        <AcountabilityTrackerStack.Screen name={routes.accountabilityPastActivitesScreen} component={PastActivities} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <AcountabilityTrackerStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </AcountabilityTrackerStack.Navigator>
    </View>
  )
}
export default StackAcountabilityTracker