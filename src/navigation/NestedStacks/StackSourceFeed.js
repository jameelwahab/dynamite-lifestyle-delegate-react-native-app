
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



const FeedSourceStack = createNativeStackNavigator()

const StackSourceFeed = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <FeedSourceStack.Navigator
        initialRouteName={routes.sourceFeedScreen}
        screenOptions={{ headerShown: false }}>
        <FeedSourceStack.Screen initialParams={route.params} name={routes.sourceFeedScreen} component={Feed} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <FeedSourceStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </FeedSourceStack.Navigator>
    </View>
  )
}
export default StackSourceFeed