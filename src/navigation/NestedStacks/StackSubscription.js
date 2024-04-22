
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import SubscriptionList from '../../screens/Subscriptions/SubscriptionList'
import Filter from '../../screens/Subscriptions/Filter'



const SubscriptionStack = createNativeStackNavigator()

const StackSubscription = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SubscriptionStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SubscriptionStack.Screen initialParams={route.params} name={routes.subscriptionList} component={SubscriptionList} />
        <SubscriptionStack.Screen name={routes.subscriptionFilter} component={Filter} />
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