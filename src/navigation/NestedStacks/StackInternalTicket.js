
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
import SendReminderScreen from '../../screens/SupportTicket/SendReminder'
import { colors } from '../../utilities/colors'
import AddNote from '../../screens/Notes/AddNote'
import NotesList from '../../screens/Notes/List'


const InternalTicketStack = createNativeStackNavigator()

const StackInternalTickets = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <InternalTicketStack.Navigator
        initialRouteName={routes.supportTicketList}
        screenOptions={{ headerShown: false, }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <InternalTicketStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}


        {/*//? Default Screens End */}
        <InternalTicketStack.Screen initialParams={route.params} name={routes.supportTicketList} component={TicketsList} />
        <InternalTicketStack.Screen initialParams={route.params} name={routes.supportTicketDeatail} component={TicketDetail} />
        <InternalTicketStack.Screen initialParams={route.params} name={routes.supportTicketReply} component={TicketReply} />

        <InternalTicketStack.Screen initialParams={route.params} name={routes.sendReminderScreen} component={SendReminderScreen} />
        <InternalTicketStack.Screen initialParams={route.params} name={routes.addNote} component={AddNote} />


      </InternalTicketStack.Navigator>
    </View>
  )
}
export default StackInternalTickets