import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'

const GroupDetail = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")

  useEffect(() => { }, [])

  return (
    <RootView hideBackBottomButton title={"Add Group"}>
      <MyText>Add Group</MyText>
    </RootView>
  )
}

export default GroupDetail