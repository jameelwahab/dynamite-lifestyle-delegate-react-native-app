import { View, Text } from 'react-native'
import React from 'react'
import routes from '../routes';
import Commission from '../../screens/Payments/Commission';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const CommissionsStack = createNativeStackNavigator();

const StackCommissions = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <CommissionsStack.Navigator
        initialRouteName={routes.commissionDetailScreen}
        screenOptions={{ headerShown: false }}>
        <CommissionsStack.Screen initialParams={route.params}
         name={routes.commissionDetailScreen} component={Commission} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <CommissionsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </CommissionsStack.Navigator>
    </View>
  )
}

export default StackCommissions