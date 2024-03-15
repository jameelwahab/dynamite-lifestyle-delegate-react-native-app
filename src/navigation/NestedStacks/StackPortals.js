import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from '../routes';
import { defaultScreens } from './defaultScreens';
//? screens

import PortalList from '../../screens/Portal/PortalListing';
import PortalDetail from '../../screens/Portal/PortalDetail';


const Portals = createNativeStackNavigator();

const StackPortals = ({ route }) => {
  return (
    <Portals.Navigator
      initialRouteName={routes.portalListScreen}
      screenOptions={{ headerShown: false }}>
      <Portals.Screen initialParams={route.params} name={routes.portalListScreen} component={PortalList} />
      <Portals.Screen name={routes.portalDetailScreen} component={PortalDetail} />

      {/*//? Default Screens Start */}
      {defaultScreens.map((x, i) => (
        <Portals.Screen key={x.name} name={x.name} component={x.component} />
      ))}
      {/*//? Default Screens End */}


    </Portals.Navigator>
  )
}

export default StackPortals