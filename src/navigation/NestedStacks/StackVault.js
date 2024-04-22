
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import RecordingList from '../../screens/Recordings/RecordingList'
import RecordingAddEdit from '../../screens/Recordings/RecordingAddEdit'
import RecordingDetail from '../../screens/Recordings/RecordingDetail'
import VaultList from '../../screens/Vault/VaultList'





const VaultStack = createNativeStackNavigator()

const StackVault = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <VaultStack.Navigator
        initialRouteName={routes.sourceFeedScreen}
        screenOptions={{ headerShown: false }}>
        <VaultStack.Screen initialParams={route.params} name={routes.vaultList} component={VaultList} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <VaultStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </VaultStack.Navigator>
    </View>
  )
}
export default StackVault