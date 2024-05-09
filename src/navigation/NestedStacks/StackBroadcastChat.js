
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import ChatList from '../../screens/BroadCastChat/Chatlist'
import MessageList from '../../screens/BroadCastChat/MessageList'
import StartNewChat from '../../screens/BroadCastChat/StartNewChat'



const BroadcastStack = createNativeStackNavigator()

const StackBroadcast = ({navigation,route}) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <BroadcastStack.Navigator
        initialRouteName={routes.broadcastChatList}
        screenOptions={{ headerShown: false }}>


        <BroadcastStack.Screen initialParams={route?.params} name={routes.broadcastChatList} component={ChatList} />
        <BroadcastStack.Screen name={routes.broadcastChatMessageList} component={MessageList} />
        <BroadcastStack.Screen name={routes.broadcastStartNewChat} component={StartNewChat} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <BroadcastStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}

      </BroadcastStack.Navigator>
    </View>
  )
}

export default StackBroadcast