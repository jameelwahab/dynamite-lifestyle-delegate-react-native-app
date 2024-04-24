
import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import routes from '../routes'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'


import Bookings from '../../screens/Appointments/Bookings/Bookings'
import AddBooking from '../../screens/Appointments/Bookings/AddBooking'
import BookingFilter from '../../screens/Appointments/Bookings/BookingFilter'
import GenericQuetionList from '../../screens/Questions/GenericQuetionList'
import BookingNotesList from '../../screens/Appointments/Bookings/Notes/BookingNotesList'
import AddNote from '../../screens/Appointments/Bookings/Notes/AddNote'



const BookingsStack = createNativeStackNavigator()

const StackBookings = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <BookingsStack.Navigator initialRouteName={routes.bookingList}
        screenOptions={{ headerShown: false }}>

        <BookingsStack.Screen initialParams={route?.params} name={routes.bookingList} component={Bookings} />
        <BookingsStack.Screen name={routes.bookingAdd} component={AddBooking} />
        <BookingsStack.Screen name={routes.bookingFilter} component={BookingFilter} />
        <BookingsStack.Screen name={routes.genericQestionListing} component={GenericQuetionList} />
        <BookingsStack.Screen name={routes.bookingNotesList} component={BookingNotesList} />
        <BookingsStack.Screen name={routes.bookingAddNote} component={AddNote} />


        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <BookingsStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}




      </BookingsStack.Navigator>
    </View>
  )
}
export default StackBookings