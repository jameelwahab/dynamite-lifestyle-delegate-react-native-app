import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from '../routes';
import ChatList from '../../screens/WhatsappChat/Chatlist.js';
import MessageList from '../../screens/WhatsappChat/MessageList.js';
import StartNewChat from '../../screens/WhatsappChat/StartNewChat.js';
import { defaultScreens } from './defaultScreens';


const WhatsappChatStack = createNativeStackNavigator();
const StackWhatsApp = () => {

  return (
    <WhatsappChatStack.Navigator
      initialRouteName={routes.whtasappChatList}
      screenOptions={{ headerShown: false }}>

      <WhatsappChatStack.Screen name={routes.whtasappChatList} component={ChatList} />
      <WhatsappChatStack.Screen name={routes.whtasappChatMessageList} component={MessageList} />
      <WhatsappChatStack.Screen name={routes.whtasappStartNewChat} component={StartNewChat} />
      {/*//? Default Screens Start */}
      {defaultScreens.map((x, i) => (
        <WhatsappChatStack.Screen key={x.name} name={x.name} component={x.component} />
      ))}
      {/*//? Default Screens End */}


    </WhatsappChatStack.Navigator>
  )
}

export default StackWhatsApp