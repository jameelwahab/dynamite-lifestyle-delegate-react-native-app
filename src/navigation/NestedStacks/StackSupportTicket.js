
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
const SupportTicketStack = createNativeStackNavigator()

const StackSupportTicket = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
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
        <SupportTicketStack.Screen name={routes.supportTicketReply} component={TicketReply} />
        <SupportTicketStack.Screen name={routes.supportTicketNotes} component={Notes} />
        <SupportTicketStack.Screen name={routes.chat} component={ChatScreen} />
        <SupportTicketStack.Screen name={routes.sendReminderScreen} component={SendReminderScreen} />


        <SupportTicketStack.Group screenOptions={{ presentation: "modal", animation: "slide_from_bottom" }} >
          <SupportTicketStack.Screen name={routes.addNote} component={AddNote} />
          <SupportTicketStack.Screen name={routes.notesListing} component={NotesList} />
        </SupportTicketStack.Group>
      </SupportTicketStack.Navigator>
    </View>
  )
}

export default StackSupportTicket