
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import GroupList from '../../screens/Calendar/Groups/GroupList'
import GroupAddEdit from '../../screens/Calendar/Groups/GroupAddEdit'
import GroupDetail from '../../screens/Calendar/Groups/GroupDetail'



const StackGroup = createNativeStackNavigator()

const StackCalendarGroups = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <StackGroup.Navigator
        screenOptions={{ headerShown: false }}>
        <StackGroup.Screen initialParams={route.params} name={routes.calendarGroupList} component={GroupList} />
        <StackGroup.Screen  name={routes.calendarGroupAddEdit} component={GroupAddEdit} />
        <StackGroup.Screen  name={routes.calendarGroupDetail} component={GroupDetail} />
        
        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <StackGroup.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </StackGroup.Navigator>
    </View>
  )
}
export default StackCalendarGroups