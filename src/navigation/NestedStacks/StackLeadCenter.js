
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import LeadCenter from '../../screens/LeadCenter/index2.js'




const LeadCenterStack = createNativeStackNavigator()

const StackLeadCenter = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <LeadCenterStack.Navigator
        initialRouteName={routes.missionControlScreen}
        screenOptions={{ headerShown: false }}>

        <LeadCenterStack.Screen name={routes.leadcenterScreen} component={LeadCenter} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <LeadCenterStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </LeadCenterStack.Navigator>
    </View>
  )
}
export default StackLeadCenter