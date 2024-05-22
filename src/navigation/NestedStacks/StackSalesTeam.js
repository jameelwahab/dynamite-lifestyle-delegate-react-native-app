
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import TeamList from '../../screens/Sales/Team/TeamList'
import TeamAddEdit from '../../screens/Sales/Team/TeamAddEdit'





const SalesTeamStack = createNativeStackNavigator()

const StackSalesTeam = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SalesTeamStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SalesTeamStack.Screen initialParams={route.params} name={routes.salesTeamListing} component={TeamList} />
        <SalesTeamStack.Screen name={routes.salesTeamAddEdit} component={TeamAddEdit} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SalesTeamStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SalesTeamStack.Navigator>
    </View>
  )
}
export default StackSalesTeam