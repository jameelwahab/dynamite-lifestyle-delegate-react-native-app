
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import CalendarEvents from '../../screens/Calendar/CalendarEvents'
import AddEditEvent from '../../screens/Calendar/AddEditEvent'
import CalendarNotifications from '../../screens/Calendar/AddEditEvent/CalendarNotifications'





const CalendarEventsStack = createNativeStackNavigator()

const StackCalendarEvents = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <CalendarEventsStack.Navigator
        screenOptions={{ headerShown: false }}>
        <CalendarEventsStack.Screen initialParams={route.params}
          name={routes.calendarEventsList} component={CalendarEvents} />
        <CalendarEventsStack.Screen name={routes.calendarEventsAddEdit} component={AddEditEvent} />
        <CalendarEventsStack.Screen name={routes.calendarEventsAddEditNotification} component={CalendarNotifications} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <CalendarEventsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </CalendarEventsStack.Navigator>
    </View>
  )
}
export default StackCalendarEvents