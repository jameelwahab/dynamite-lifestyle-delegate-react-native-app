
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import List from '../../screens/MemberAnswerList/List'
import GenericQuetionList from '../../screens/Questions/GenericQuetionList'
import Filter from '../../screens/MemberAnswerList/Filter'





const MemberAnswersStack = createNativeStackNavigator()

const StackMembersAnswer = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <MemberAnswersStack.Navigator
        screenOptions={{ headerShown: false }}>
        <MemberAnswersStack.Screen initialParams={route.params} name={routes.memberAnswersList} component={List} />
        <MemberAnswersStack.Screen name={routes.memberAnswersFilter} component={Filter} />
        <MemberAnswersStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <MemberAnswersStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </MemberAnswersStack.Navigator>
    </View>
  )
}
export default StackMembersAnswer