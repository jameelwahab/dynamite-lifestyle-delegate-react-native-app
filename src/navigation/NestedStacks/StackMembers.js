

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
import MemberManage from '../../screens/Members/MemberManage/'
import MessageList from '../../screens/WhatsappChat/MessageList.js'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MemberListForSubTeam from '../../screens/Members/MemberListForSubTeam'
import MissionReport from '../../screens/MissionReport/MissionReport'


const MemberStack = createNativeStackNavigator()

const StackMembers = ({ route }) => {
  const { user } = useSelector(selectUser);
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <MemberStack.Navigator
        initialRouteName={routes.allMemberScreens}
        screenOptions={{ headerShown: false }}>
        <MemberStack.Screen initialParams={route.params} name={routes.allMemberScreens} component={user?.team_type == "sub_team" ? MemberListForSubTeam : MemberList} />
        <MemberStack.Screen initialParams={route.params} name={routes.memberManage} component={MemberManage} />
        <MemberStack.Screen initialParams={route.params} name={routes.memberDetails} component={MemberDetail} />
        <MemberStack.Screen name={routes.memberNotesListing} component={List} />
        <MemberStack.Screen name={routes.memberAddNote} component={AddNote} />
        <MemberStack.Screen name={routes.memberSubscribersListing} component={SubscriptionList} />
        <MemberStack.Screen name={routes.memberQuestionListing} component={QuestionsList} />
        <MemberStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        <MemberStack.Screen name={routes.memberProfile} component={MemberProfile} />
        <MemberStack.Screen name={routes.whtasappChatMessageList} component={MessageList} />
        <MemberStack.Screen name={routes.missionReportScreen} component={MissionReport} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <MemberStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </MemberStack.Navigator>
    </View>
  )
}
export default StackMembers
