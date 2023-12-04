
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import ChatList from '../../screens/Chat/Chatlist.js'
import MessageList from '../../screens/Chat/MessageList.js'
import StartNewChat from '../../screens/Chat/StartNewChat.js'


const ChatStack = createNativeStackNavigator()

const StackChat = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <ChatStack.Navigator
        initialRouteName={routes.chatList}
        screenOptions={{ headerShown: false }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <ChatStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}

        <ChatStack.Screen name={routes.chatList} component={ChatList} />
        <ChatStack.Screen name={routes.chatMessageList} component={MessageList} />
        <ChatStack.Screen name={routes.startNewChat} component={StartNewChat} />

      </ChatStack.Navigator>
    </View>
  )
}

export default StackChat