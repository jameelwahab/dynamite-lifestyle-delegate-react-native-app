import { View, Text } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../components/MyText'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'

const LinksList = ({ navigtaion, route }) => {
  const { key } = route?.params;
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == key)?.title);

  return (
    <RootView hideBackBottomButton title={title} >
      <MyText>Links list</MyText>
    </RootView>
  )
}

export default LinksList