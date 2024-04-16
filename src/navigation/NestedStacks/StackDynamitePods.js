import { View, Text } from 'react-native'
import React from 'react'
import routes from '../routes';
import Commission from '../../screens/Payments/Commission';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DynamitePods from '../../screens/Pods/DynamitePods';

const DynamitePodStack = createNativeStackNavigator();

const StackDynamitePod = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DynamitePodStack.Navigator
        screenOptions={{ headerShown: false }}>
        <DynamitePodStack.Screen initialParams={route.params}
          name={routes.dynamitePodScreen} component={DynamitePods} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <DynamitePodStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </DynamitePodStack.Navigator>
    </View>
  )
}

export default StackDynamitePod