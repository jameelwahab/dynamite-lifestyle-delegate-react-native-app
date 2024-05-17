import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'

const BookingDelegate = ({ navigation, route }) => {
  const { item } = route?.params
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);


  useEffect(() => { }, [])


  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <MyText isHeading> {`${item?.first_name} ${item?.last_name} Bookings`}</MyText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.delegateReportSalesFilterScreen, {
            delegateId: item?._id,
            filters,
            item
          })}
          style={{ paddingRight: 5 }}>
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View >
    )
  }

  return (
    <RootView titleView={topView} >
      <MyText>BookingDelegate</MyText>
    </RootView>
  )
}

export default BookingDelegate
