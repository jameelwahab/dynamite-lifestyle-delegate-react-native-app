
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Responded from '../../screens/SelfImage/List/Responded'
import SelfImageDetail from '../../screens/SelfImage/Detail'
import AddReply from '../../screens/SelfImage/Detail/AddReply'











const SelfImageRespondedStack = createNativeStackNavigator()

const StackSelfImageResponded = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SelfImageRespondedStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SelfImageRespondedStack.Screen initialParams={route.params}
          name={routes.selfImageResponedScreen} component={Responded} />
        <SelfImageRespondedStack.Screen name={routes.selfImageDetail} component={SelfImageDetail} />
        <SelfImageRespondedStack.Screen name={routes.selfImageAddReply} component={AddReply} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SelfImageRespondedStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SelfImageRespondedStack.Navigator>
    </View>
  )
}
export default StackSelfImageResponded