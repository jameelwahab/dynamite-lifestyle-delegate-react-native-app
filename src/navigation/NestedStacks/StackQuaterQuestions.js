

import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import QuaterList from '../../screens/QuaterQuestions/QuaterList'
import QuaterDetail from '../../screens/QuaterQuestions/QuaterDetail'





const QuaterQsStack = createNativeStackNavigator()

const StackQuaterQuestions = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <QuaterQsStack.Navigator
        screenOptions={{ headerShown: false }}>
        <QuaterQsStack.Screen initialParams={route.params} name={routes.quaterQuestionList} component={QuaterList} />
        <QuaterQsStack.Screen  name={routes.quaterQuestionDetail} component={QuaterDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <QuaterQsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </QuaterQsStack.Navigator>
    </View>
  )
}
export default StackQuaterQuestions