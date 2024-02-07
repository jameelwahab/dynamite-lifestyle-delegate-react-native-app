
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import Dasboard from '../../screens/Dashboard'
import FilterScreen from '../../screens/Dashboard/FilterScreen'
import Feed from '../../screens/Feed'
import Detail from '../../screens/Feed/Detail'
// import FeedScreen from '../../screens/Feed/FeedScreen'



const FeedStack = createNativeStackNavigator()

const StackFeed = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <FeedStack.Navigator
        initialRouteName={routes.feedScreen}
        screenOptions={{ headerShown: false }}>
        <FeedStack.Screen initialParams={route.params} name={routes.feedScreen} component={Feed} />
        <FeedStack.Screen initialParams={route.params} name={routes.feedDetailScreen} component={Detail} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <FeedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </FeedStack.Navigator>
    </View>
  )
}
export default StackFeed