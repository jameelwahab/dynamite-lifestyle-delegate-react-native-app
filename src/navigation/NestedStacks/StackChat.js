
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'

import Chat from '../../screens/Chat/ChatScreen'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'


const ChatStack = createNativeStackNavigator()

const StackChat = () => {
  return (
    <View style={{flex:1,backgroundColor:colors.secondary}}>
      <ChatStack.Navigator
        initialRouteName={routes.chat}
        screenOptions={{ headerShown: false }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <ChatStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}

        <ChatStack.Screen name={routes.chat} component={Chat} />
      </ChatStack.Navigator>
    </View>
  )
}

export default StackChat