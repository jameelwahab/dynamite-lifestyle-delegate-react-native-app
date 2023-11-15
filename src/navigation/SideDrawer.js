import { View, Text, Image } from 'react-native'
import React from 'react'
import routes from './routes';
import TicketsList from '../screens/SupportTicket/Listings';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { icons } from '../utilities/icons';
import SideBar from '../screens/SideBar'
import StackSupportTicket from './NestedStacks/StackSupportTicket';
import { colors } from '../utilities/colors';


const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, drawerType: 'front',
        drawerStyle: { backgroundColor: colors.secondary },
        drawerActiveTintColor: colors.primary
      }}
    drawerContent={props => <SideBar {...props} />}

    >
      <Drawer.Screen

        options={{
          title: "Support Tickets",
          drawerIcon: ({ focused, size }) => (
            <Image
              source={icons.handPromise}
              style={{ height: 20, width: 20 }}
            />
          ),
        }}
        name={routes.supportTicketNavigator}
        component={StackSupportTicket} />
    </Drawer.Navigator>
  )
}

export default SideDrawer