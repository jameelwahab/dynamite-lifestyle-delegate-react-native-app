import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_TRAINING_LESSONS_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'

const TrainingLessonList = ({ navigation, route }) => {
  let { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    getDataFromServer()
  }, [])

  const getDataFromServer = async () => {
    let res = await GET_TRAINING_LESSONS_LIST({ navigation, token, slug });
    if (res.code == 200) {
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  return (
    <RootView  >
      <MyText>TrainingLessonList</MyText>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default TrainingLessonList