import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'
import routes from '../routes';
import TicketsList from '../../screens/SupportTicket/Listings';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { icons } from '../../utilities/icons';
import SideBar from '.'
import { colors } from '../../utilities/colors';
import { drawerMenuList } from './List';


const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        headerShown: false, drawerType: 'front',
        drawerStyle: { backgroundColor: colors.secondary },
        drawerActiveTintColor: colors.primary,
        unmountOnBlur: true
      }}
      drawerContent={props => <SideBar {...props} />}

    >
      {drawerMenuList.map((x) => {
        // console.log(x, "navigators")
        return <Drawer.Screen
          key={x.key}
          name={x.key}
          component={x.component}
          initialParams={x.params}
        />
      }
      )}

    </Drawer.Navigator>
  )
}

export default SideDrawer