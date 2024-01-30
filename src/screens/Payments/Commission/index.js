import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'

const Commission = ({ route }) => {
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);

  return (
    <RootView hideBackBottomButton title={title}>
      <Text>Commission</Text>
    </RootView>
  )
}

export default Commission