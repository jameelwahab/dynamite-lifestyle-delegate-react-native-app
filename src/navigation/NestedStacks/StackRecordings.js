
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'

import RecordingList from '../../screens/Recordings/RecordingList'
import RecordingAddEdit from '../../screens/Recordings/RecordingAddEdit'
import RecordingDetail from '../../screens/Recordings/RecordingDetail'





const RecordingStack = createNativeStackNavigator()

const StackRecordings = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <RecordingStack.Navigator
        screenOptions={{ headerShown: false }}>
        <RecordingStack.Screen initialParams={route.params} name={routes.myRecordingsList} component={RecordingList} />
        <RecordingStack.Screen name={routes.myRecordingsAddEdit} component={RecordingAddEdit} />
        <RecordingStack.Screen name={routes.myRecordingsDetail} component={RecordingDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <RecordingStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </RecordingStack.Navigator>
    </View>
  )
}
export default StackRecordings