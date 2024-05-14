import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'

const DelegateReport = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")

  useEffect(() => { }, [])

  return (
    <RootView hideBackBottomButton title={title}>
      <MyText>DelegateReport</MyText>
    </RootView>
  )
}

export default DelegateReport
