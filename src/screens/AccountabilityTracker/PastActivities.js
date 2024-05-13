import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'


const PastActivities = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);

  console.log(title,"title")

  return (
    <RootView title={title} hideBackBottomButton >
      <MyText>PastActivities</MyText>
    </RootView>
  )
}

export default PastActivities