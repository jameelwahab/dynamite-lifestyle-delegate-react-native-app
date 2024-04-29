
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Incomplete from '../../screens/SelfImage/List/Incomplete'
import SelfImageDetail from '../../screens/SelfImage/Detail'
import AddReply from '../../screens/SelfImage/Detail/AddReply'









const SelfImageincompleteStack = createNativeStackNavigator()

const StackSelfImageIncomplete = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SelfImageincompleteStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SelfImageincompleteStack.Screen initialParams={route.params}
          name={routes.selfImageIncompleteScreen} component={Incomplete} />
        <SelfImageincompleteStack.Screen name={routes.selfImageDetail} component={SelfImageDetail} />
        <SelfImageincompleteStack.Screen name={routes.selfImageAddReply} component={AddReply} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SelfImageincompleteStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SelfImageincompleteStack.Navigator>
    </View>
  )
}
export default StackSelfImageIncomplete