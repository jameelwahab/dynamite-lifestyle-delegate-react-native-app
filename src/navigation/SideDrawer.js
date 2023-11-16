import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'
import routes from './routes';
import TicketsList from '../screens/SupportTicket/Listings';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { icons } from '../utilities/icons';
import SideBar from '../screens/SideBar'
import StackSupportTicket from './NestedStacks/StackSupportTicket';
import { colors } from '../utilities/colors';
import StackChat from './NestedStacks/StackChat';
import { drawerMenuList } from '../screens/SideBar/List';
import TicketDetail from '../screens/SupportTicket/Detail.js';


const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  return (
      <Drawer.Navigator
        backBehavior="firstRoute"
        // detachInactiveScreens={true}
        screenOptions={{
          headerShown: false, drawerType: 'front',
          drawerStyle: { backgroundColor: colors.secondary },
          drawerActiveTintColor: colors.primary,
          unmountOnBlur: true
        }}
        drawerContent={props => <SideBar {...props} />}

      >
        {drawerMenuList.map((x) =>
          <Drawer.Screen
            key={x.key}
            name={x.key}
            component={x.component} />
        )}

        {/* <Drawer.Screen name={routes.supportTicketDeatail} component={TicketDetail} /> */}
        {/* <Drawer.Screen
        name={routes.supportTicketNavigator}
        component={StackSupportTicket} />

      <Drawer.Screen
        name={routes.chatNavigator}
        component={StackChat} /> */}
      </Drawer.Navigator>
  )
}

export default SideDrawer