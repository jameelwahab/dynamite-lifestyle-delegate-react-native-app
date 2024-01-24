
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import MemberList from '../../screens/Members/MemberList'
import MemberDetail from '../../screens/Members/MemberDetail'
import AddNote from '../../screens/Members/Notes/AddNote'
import List from '../../screens/Members/Notes/List'
import SubscriptionList from '../../screens/Members/Subscriptions'
import QuestionsList from '../../screens/Members/QuestionsList'
import GenericQuetionList from '../../screens/Questions/GenericQuetionList'
import MemberProfile from '../../screens/Members/MemberProfile.js'





const AllMemberStack = createNativeStackNavigator()

const StackAllMember = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <AllMemberStack.Navigator
        initialRouteName={routes.allMemberScreens}
        screenOptions={{ headerShown: false }}>
        <AllMemberStack.Screen initialParams={route.params} name={routes.allMemberScreens} component={MemberList} />
        <AllMemberStack.Screen initialParams={route.params} name={routes.memberDetails} component={MemberDetail} />
        <AllMemberStack.Screen name={routes.memberNotesListing} component={List} />
        <AllMemberStack.Screen name={routes.memberAddNote} component={AddNote} />
        <AllMemberStack.Screen name={routes.memberSubscribersListing} component={SubscriptionList} />
        <AllMemberStack.Screen name={routes.memberQuestionListing} component={QuestionsList} />
        <AllMemberStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        <AllMemberStack.Screen name={routes.memberProfile} component={MemberProfile} />
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