
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import MemberList from '../../screens/MissionReport/MemberList'
import MissisonList from '../../screens/MissionReport/MissisonList'
import FilterScreen from '../../screens/MissionReport/MemberList/FilterScreen'
import MissionReport from '../../screens/MissionReport/MissionReport'



const MissionReportStack = createNativeStackNavigator()

const StackMissionReport = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <MissionReportStack.Navigator
        initialRouteName={routes.missionMembers}
        screenOptions={{ headerShown: false }}>

        {/*//? Default Screens End */}
        <MissionReportStack.Screen initialParams={route?.params} name={routes.missionMembers} component={MemberList} />
        <MissionReportStack.Screen name={routes.missionList} component={MissisonList} />
        <MissionReportStack.Screen
          name={routes.missionMembersFilterScreen}
          component={FilterScreen}
        />
        <MissionReportStack.Screen name={routes.missionReportScreen} component={MissionReport} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <MissionReportStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}

      </MissionReportStack.Navigator>
    </View>
  )
}
export default StackMissionReport
