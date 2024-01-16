
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import MemberList from '../../screens/Members/MemberList'
import MemberDetail from '../../screens/Members/MemberDetail'
// import FeedScreen from '../../screens/Feed/FeedScreen'



const AllMemberStack = createNativeStackNavigator()

const StackAllMember = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <AllMemberStack.Navigator
        initialRouteName={routes.allMemberScreens}
        screenOptions={{ headerShown: false }}>
        <AllMemberStack.Screen initialParams={route.params} name={routes.allMemberScreens} component={MemberList} />
        <AllMemberStack.Screen name={routes.memberDetails} component={MemberDetail} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <AllMemberStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </AllMemberStack.Navigator>
    </View>
  )
}
export default StackAllMember