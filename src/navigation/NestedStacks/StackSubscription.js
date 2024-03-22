
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import SubscriptionList from '../../screens/Subscriptions/SubscriptionList'



const SubscriptionStack = createNativeStackNavigator()

const StackSubscription = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SubscriptionStack.Navigator
        initialRouteName={routes.sourceFeedScreen}
        screenOptions={{ headerShown: false }}>
        <SubscriptionStack.Screen initialParams={route.params} name={routes.subscriptionList} component={SubscriptionList} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SubscriptionStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SubscriptionStack.Navigator>
    </View>
  )
}
export default StackSubscription