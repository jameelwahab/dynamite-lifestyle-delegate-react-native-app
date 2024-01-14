
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import Dasboard from '../../screens/Dashboard'
import FilterScreen from '../../screens/Dashboard/FilterScreen'
import Feed from '../../screens/Feed'
// import FeedScreen from '../../screens/Feed/FeedScreen'



const ScheduledFeedStack = createNativeStackNavigator()

const StackScheduledFeed = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <ScheduledFeedStack.Navigator
        initialRouteName={routes.scheduleFeedScreen}
        screenOptions={{ headerShown: false }}>
        <ScheduledFeedStack.Screen initialParams={route.params} name={routes.scheduleFeedScreen} component={Feed} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <ScheduledFeedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </ScheduledFeedStack.Navigator>
    </View>
  )
}
export default StackScheduledFeed