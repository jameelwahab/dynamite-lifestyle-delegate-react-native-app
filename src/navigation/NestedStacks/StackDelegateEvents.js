
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import CalendarEvents from '../../screens/Calendar/CalendarEvents'
import AddEditEvent from '../../screens/Calendar/AddEditEvent'
import CalendarNotifications from '../../screens/Calendar/AddEditEvent/CalendarNotifications'
import CalendarDetail from '../../screens/Calendar/CalendarDetail'





const DelegateEventsStack = createNativeStackNavigator()

const StackDelegateEvents = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <DelegateEventsStack.Navigator
        screenOptions={{ headerShown: false }}>
        <DelegateEventsStack.Screen initialParams={route.params}
          name={routes.calendarEventsList} component={CalendarEvents} />
        <DelegateEventsStack.Screen initialParams={route.params} name={routes.calendarEventsAddEdit} component={AddEditEvent} />
        <DelegateEventsStack.Screen initialParams={route.params} name={routes.calendarEventsAddEditNotification} component={CalendarNotifications} />
        <DelegateEventsStack.Screen initialParams={route.params} name={routes.calendarEventDetail} component={CalendarDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <DelegateEventsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </DelegateEventsStack.Navigator>
    </View>
  )
}
export default StackDelegateEvents