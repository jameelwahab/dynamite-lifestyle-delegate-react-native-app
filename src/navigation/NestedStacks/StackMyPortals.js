import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from '../routes';
import { defaultScreens } from './defaultScreens';
//? screens

import PortalList from '../../screens/Portal/PortalListing';
import PortalDetail from '../../screens/Portal/PortalDetail';
import { colors } from '../../utilities/colors';
import PortalEventsVideo from '../../screens/Portal/PortalDetail/PortalEventsVideo';
import PortalChat from '../../screens/Portal/PortalChat';

import LockEventSettings from '../../screens/Portal/PortalAction/LockEventSettings';
import AddEditPortal from '../../screens/Portal/PortalAction/AddEditPortal';
import TimerEventSettings from '../../screens/Portal/PortalAction/TimerEventSettings';
import AddMembers from '../../screens/Portal/PortalAction/AddMembers';
import MembersAddEdit from '../../screens/Portal/PortalMembers/MembersAddEdit';
import MembersList from '../../screens/Portal/PortalMembers/MembersList';
import EevntList from '../../screens/Portal/PortalEvents/EevntList';
import EventAddEdit from '../../screens/Portal/PortalEvents/EventAddEdit';
import CategoryList from '../../screens/Portal/PortalCategory/CategoryList';
import CategoryAddEdit from '../../screens/Portal/PortalCategory/CategoryAddEdit';


const MyPortals = createNativeStackNavigator();

const StackMyPortals = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <MyPortals.Navigator
        initialRouteName={routes.portalListScreen}
        screenOptions={{ headerShown: false }}>
        <MyPortals.Screen initialParams={route.params} name={routes.portalListScreen} component={PortalList} />
        <MyPortals.Screen name={routes.portalDetailScreen} component={PortalDetail} />
        <MyPortals.Screen name={routes.portalEventVidoScreen} component={PortalEventsVideo} />
        <MyPortals.Screen name={routes.portalChatList} component={PortalChat} />
        <MyPortals.Screen name={routes.portalAddEdit} component={AddEditPortal} />
        <MyPortals.Screen name={routes.portalLockSettings} component={LockEventSettings} />
        <MyPortals.Screen name={routes.portalTimerSettings} component={TimerEventSettings} />
        <MyPortals.Screen name={routes.portalAddMembers} component={AddMembers} />

        <MyPortals.Screen name={routes.portalAddEditMembers} component={MembersAddEdit} />
        <MyPortals.Screen name={routes.portalMembersList} component={MembersList} />

        <MyPortals.Screen name={routes.portalEventsList} component={EevntList} />        
        <MyPortals.Screen name={routes.portalAddEditEvents} component={EventAddEdit} />

        <MyPortals.Screen name={routes.portalCategoryList} component={CategoryList} />        
        <MyPortals.Screen name={routes.portalAddEditCategory} component={CategoryAddEdit} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <MyPortals.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}


      </MyPortals.Navigator>
    </View>
  )
}

export default StackMyPortals