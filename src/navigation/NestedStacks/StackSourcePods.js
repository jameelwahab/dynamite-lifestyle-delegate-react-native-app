import { View, Text } from 'react-native'
import React from 'react'
import routes from '../routes';
import Commission from '../../screens/Payments/Commission';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SourcePod from '../../screens/Pods/SourcePod';
import Filter from '../../screens/Pods/Filter';
import PodAdd from '../../screens/Pods/PodAdd';
import PodDetail from '../../screens/Pods/PodDetail';

const SourcePodStack = createNativeStackNavigator();

const StackSourcePod = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <SourcePodStack.Navigator
        screenOptions={{ headerShown: false }}>
        <SourcePodStack.Screen initialParams={route.params}
          name={routes.sourcePodScreen} component={SourcePod} />

        <SourcePodStack.Screen name={routes.podFilterScreen} component={Filter} />
        <SourcePodStack.Screen name={routes.podAddScreen} component={PodAdd} />
        <SourcePodStack.Screen initialParams={route.params}
          name={routes.podDetailScreen} component={PodDetail} />


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