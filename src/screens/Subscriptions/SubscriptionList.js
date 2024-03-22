import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'



const SubscriptionList = ({ navigtaion, route }) => {
  const { key } = route?.params;
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == key)?.title);

  return (
    <RootView hideBackBottomButton title={title} >
      <MyText>SubscriptionList</MyText>
    </RootView>
  )
}

export default SubscriptionList