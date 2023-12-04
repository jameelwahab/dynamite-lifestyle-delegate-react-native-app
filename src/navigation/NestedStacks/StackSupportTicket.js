
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import TicketsList from '../../screens/SupportTicket/Listings'
import { defaultScreens } from './defaultScreens'
import TicketDetail from '../../screens/SupportTicket/Detail.js/index.js'
import TicketReply from '../../screens/SupportTicket/ReplyTicket'
import SendReminderScreen from '../../screens/SupportTicket/SendReminder'
import { colors } from '../../utilities/colors'
import AddNote from '../../screens/Notes/AddNote'


const SupportTicketStack = createNativeStackNavigator()
const StackInner = ({route}) => {
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

        <SupportTicketStack.Screen initialParams={route.params} name={routes.supportTicketList} component={TicketsList} />
        <SupportTicketStack.Screen initialParams={route.params} name={routes.supportTicketDeatail} component={TicketDetail} />
        <SupportTicketStack.Screen initialParams={route.params} name={routes.supportTicketReply} component={TicketReply} />
        <SupportTicketStack.Screen initialParams={route.params} name={routes.sendReminderScreen} component={SendReminderScreen} />
        <SupportTicketStack.Screen initialParams={route.params} name={routes.addNote} component={AddNote} />

      </SupportTicketStack.Navigator>
    </View>
  )
}
export default StackInner