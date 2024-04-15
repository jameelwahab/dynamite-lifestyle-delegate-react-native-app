
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import _90daysPlan from '../../screens/90days/Plan'



const _90DaysPlanStack = createNativeStackNavigator()

const Stack90DaysPlan = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <_90DaysPlanStack.Navigator
        initialRouteName={routes._90daysPlan}
        screenOptions={{ headerShown: false }}>

        <_90DaysPlanStack.Screen initialParams={route?.params}
          name={routes._90daysPlan}
          component={_90daysPlan} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <_90DaysPlanStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </_90DaysPlanStack.Navigator>
    </View>
  )
}
export default Stack90DaysPlan