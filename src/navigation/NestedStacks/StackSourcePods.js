import { View, Text } from 'react-native'
import React from 'react'
import routes from '../routes';
import Commission from '../../screens/Payments/Commission';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SourcePod from '../../screens/Pods/SourcePod';

const SourcePodStack = createNativeStackNavigator();

const StackSourcePod= ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SourcePodStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SourcePodStack.Screen initialParams={route.params}
         name={routes.sourcePodScreen} component={SourcePod} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SourcePodStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SourcePodStack.Navigator>
    </View>
  )
}

export default StackSourcePod