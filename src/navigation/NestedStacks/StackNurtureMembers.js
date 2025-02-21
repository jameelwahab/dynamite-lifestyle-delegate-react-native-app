

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
import GenericQuetionList from '../../screens/Questions/GenericQuetionList'
import QuestionsList from '../../screens/Members/QuestionsList'
import MemberProfile from '../../screens/Members/MemberProfile.js'
import MessageList from '../../screens/WhatsappChat/MessageList.js'
import MemberManage from '../../screens/Members/MemberManage'
import MissionReport from '../../screens/MissionReport/MissionReport'


const NurtureStack = createNativeStackNavigator()

const StackNurtureMembers = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <NurtureStack.Navigator
        initialRouteName={routes.allMemberScreens}
        screenOptions={{ headerShown: false }}>
        <NurtureStack.Screen initialParams={route.params} name={routes.allMemberScreens} component={MemberList} />
        <NurtureStack.Screen initialParams={route.params} name={routes.memberManage} component={MemberManage} />
        <NurtureStack.Screen initialParams={route.params} name={routes.memberDetails} component={MemberDetail} />
        <NurtureStack.Screen name={routes.memberNotesListing} component={List} />
        <NurtureStack.Screen name={routes.memberAddNote} component={AddNote} />
        <NurtureStack.Screen name={routes.memberSubscribersListing} component={SubscriptionList} />
        <NurtureStack.Screen name={routes.memberQuestionListing} component={QuestionsList} />
        <NurtureStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        <NurtureStack.Screen name={routes.memberProfile} component={MemberProfile} />
        <NurtureStack.Screen name={routes.whtasappChatMessageList} component={MessageList} />
        <NurtureStack.Screen name={routes.missionReportScreen} component={MissionReport} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <NurtureStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </NurtureStack.Navigator>
    </View>
  )
}
export default StackNurtureMembers
