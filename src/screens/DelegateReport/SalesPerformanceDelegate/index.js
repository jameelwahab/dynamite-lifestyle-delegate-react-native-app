import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'

const SalesPerformanceDelegate = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);


  useEffect(() => { }, [])

  return (
    <RootView >
      <MyText>SalesPerformanceDelegate</MyText>
    </RootView>
  )
}

export default SalesPerformanceDelegate
