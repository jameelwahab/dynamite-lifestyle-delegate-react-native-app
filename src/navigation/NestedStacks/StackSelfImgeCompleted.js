
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Complete from '../../screens/SelfImage/List/Complete'
import SelfImageDetail from '../../screens/SelfImage/Detail'
import AddReply from '../../screens/SelfImage/Detail/AddReply'








const SelfImageCompletedStack = createNativeStackNavigator()

const StackSelfImageCompleted = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SelfImageCompletedStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SelfImageCompletedStack.Screen initialParams={route.params}
          name={routes.selfImageCompleteScreen} component={Complete} />
        <SelfImageCompletedStack.Screen name={routes.selfImageDetail} component={SelfImageDetail} />
        <SelfImageCompletedStack.Screen name={routes.selfImageAddReply} component={AddReply} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SelfImageCompletedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SelfImageCompletedStack.Navigator>
    </View>
  )
}
export default StackSelfImageCompleted