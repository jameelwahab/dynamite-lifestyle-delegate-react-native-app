
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import Helptechlist from '../../screens/Helptech/Helptechlist'
import HelptechDetail from '../../screens/Helptech/HelptechDetail'





const HelpTechStack = createNativeStackNavigator()

const StackHelpTech = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <HelpTechStack.Navigator
        screenOptions={{ headerShown: false }}>
        <HelpTechStack.Screen initialParams={route.params} name={routes.helptechListScreen} component={Helptechlist} />
        <HelpTechStack.Screen name={routes.helptechDetailScreen} component={HelptechDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <HelpTechStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </HelpTechStack.Navigator>
    </View>
  )
}
export default StackHelpTech