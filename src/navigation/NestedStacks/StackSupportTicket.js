
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import TicketsList from '../../screens/SupportTicket/Listings'
import OtherSettings from '../../screens/Settings/OtherSettings'
import ChangePassword from '../../screens/Profile/ChangePassword'
import { defaultScreens } from './defaultScreens'
import TicketDetail from '../../screens/SupportTicket/Detail.js/index.js'
import TicketReply from '../../screens/SupportTicket/ReplyTicket'
import Notes from '../../screens/SupportTicket/Notes'
import ChatScreen from '../../screens/Chat/ChatScreen'
import { colors } from '../../utilities/colors'
const SupportTicketStack = createNativeStackNavigator()

const StackSupportTicket = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <SupportTicketStack.Navigator
        initialRouteName={routes.supportTicketList}
        screenOptions={{ headerShown: false }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SupportTicketStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}


        {/*//? Default Screens End */}
        <SupportTicketStack.Screen name={routes.supportTicketList} component={TicketsList} />
        <SupportTicketStack.Screen name={routes.supportTicketDeatail} component={TicketDetail} />
        <SupportTicketStack.Screen options={{ gestureEnabled: false, }}
          name={routes.supportTicketReply} component={TicketReply} />
        <SupportTicketStack.Screen name={routes.supportTicketNotes} component={Notes} />
        <SupportTicketStack.Screen name={routes.chat} component={ChatScreen} />
      </SupportTicketStack.Navigator>
    </View>
  )
}

export default StackSupportTicket