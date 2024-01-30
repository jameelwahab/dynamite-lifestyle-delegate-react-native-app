import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'

const Transactions = ({navigation,route}) => {
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  return (
    <RootView title={title} hideBackBottomButton>
      <Text>Transactions</Text>
    </RootView>
  )
}

export default Transactions