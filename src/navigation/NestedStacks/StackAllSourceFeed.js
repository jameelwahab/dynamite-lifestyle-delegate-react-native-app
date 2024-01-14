
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



const FeedAllSourceStack = createNativeStackNavigator()

const StackAllSourceFeed = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <FeedAllSourceStack.Navigator
        initialRouteName={routes.allSourceFeedScreen}
        screenOptions={{ headerShown: false }}>
        <FeedAllSourceStack.Screen initialParams={route.params} name={routes.allSourceFeedScreen} component={Feed} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <FeedAllSourceStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </FeedAllSourceStack.Navigator>
    </View>
  )
}
export default StackAllSourceFeed