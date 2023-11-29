
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import List from '../../screens/ContactSupport/list'
import AddTicket from '../../screens/ContactSupport/AddTicket'
import Detail from '../../screens/SupportTicket/Detail.js'
import TicketReply from '../../screens/SupportTicket/ReplyTicket'




const SupportStack = createNativeStackNavigator()

const StackContactSupport = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SupportStack.Navigator
        initialRouteName={routes.ticketList}
        screenOptions={{ headerShown: false }}>
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SupportStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
        <SupportStack.Screen name={routes.supportTicketDeatail} component={Detail} />
        <SupportStack.Screen name={routes.ticketList} component={List} />
        <SupportStack.Screen name={routes.addTicket} component={AddTicket} />
        <SupportStack.Screen name={routes.supportTicketReply} component={TicketReply} />


      </SupportStack.Navigator>
    </View>
  )
}
export default StackContactSupport