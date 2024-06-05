
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import LinksList from '../../screens/Links/LinksList'
import LinksPaymentPlanList from '../../screens/Links/LinksPaymentPlanList:'
import LinksSalesCommission from '../../screens/Links/LinksSalesCommission'





const LinksStack = createNativeStackNavigator()

const StackLinks = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <LinksStack.Navigator
        screenOptions={{ headerShown: false }}>
        <LinksStack.Screen initialParams={route.params} name={routes.linksListing} component={LinksList} />
        <LinksStack.Screen name={routes.linksPaymentPlan} component={LinksPaymentPlanList} />
        <LinksStack.Screen name={routes.linksManageSaleTeamCommission} component={LinksSalesCommission} />
        
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <LinksStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </LinksStack.Navigator>
    </View>
  )
}
export default StackLinks