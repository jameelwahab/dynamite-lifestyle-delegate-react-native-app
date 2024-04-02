
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import Configurations from '../../screens/Appointments/Configuration'



const ConfigurationStack = createNativeStackNavigator()

const StackBookingConfiguration = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <ConfigurationStack.Navigator
        initialRouteName={routes.bookingList}
        screenOptions={{ headerShown: false }}>

        <ConfigurationStack.Screen initialParams={route?.params} name={routes.bookingConfigurationScreen} component={Configurations} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <ConfigurationStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </ConfigurationStack.Navigator>
    </View>
  )
}
export default StackBookingConfiguration