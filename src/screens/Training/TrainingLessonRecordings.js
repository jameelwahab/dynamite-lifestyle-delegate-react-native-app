import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'

const TrainingLessonRecordings = ({ navigation, route }) => {
  let { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getDataFromServer()
  }, [])

  const getDataFromServer = async () => {
    return
    let res = await ({});
    if (res.code == 200) {
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  return (
    <RootView>
      <MyText>TrainingLessonRecordings</MyText>
    </RootView>
  )
}

export default TrainingLessonRecordings