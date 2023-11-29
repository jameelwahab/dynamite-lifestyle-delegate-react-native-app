import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'

const AddTicket = () => {
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);



  return (
    <RootView>
      <Text>AddTicket</Text>
    </RootView>
  )
}

export default AddTicket