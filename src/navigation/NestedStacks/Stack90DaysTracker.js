
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import _90daysTracker from '../../screens/90days/Tracker'
import AddEditEarning from '../../screens/90days/Tracker/AddEditEarning'



const _90DaysPlanTrackerStack = createNativeStackNavigator()

const Stack90DaysTracker = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <_90DaysPlanTrackerStack.Navigator
        initialRouteName={routes._90daysTracker}
        screenOptions={{ headerShown: false }}>

        <_90DaysPlanTrackerStack.Screen initialParams={route?.params}
          name={routes._90daysTracker}
          component={_90daysTracker} />
        <_90DaysPlanTrackerStack.Screen
          name={routes.addEditEarnings}
          component={AddEditEarning} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <_90DaysPlanTrackerStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </_90DaysPlanTrackerStack.Navigator>
    </View>
  )
}
export default Stack90DaysTracker