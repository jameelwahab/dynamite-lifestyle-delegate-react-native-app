import { View, Text } from 'react-native'
import React from 'react'
import routes from '../routes';
import Commission from '../../screens/Payments/Commission';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookCallPods from '../../screens/Pods/BookCallPods';
import Filter from '../../screens/Pods/Filter';
import PodAdd from '../../screens/Pods/PodAdd';
import PodDetail from '../../screens/Pods/PodDetail';

const SourceBookCallStack = createNativeStackNavigator();

const StackBookCallPod = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SourceBookCallStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SourceBookCallStack.Screen initialParams={route.params}
          name={routes.bookcallPodScreen} component={BookCallPods} />
        <SourceBookCallStack.Screen name={routes.podFilterScreen} component={Filter} />
        <SourceBookCallStack.Screen name={routes.podAddScreen} component={PodAdd} />
        <SourceBookCallStack.Screen initialParams={route.params}
          name={routes.podDetailScreen} component={PodDetail} />
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <SourceBookCallStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </SourceBookCallStack.Navigator>
    </View>
  )
}

export default StackBookCallPod