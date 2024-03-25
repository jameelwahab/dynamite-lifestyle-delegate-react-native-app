import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyLoader from '../../components/MyLoader'
import { QUESTIONS_LIST } from '../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import EmptyView from '../../components/EmptyView'
import { colors } from '../../utilities/colors'
import MyWebview from '../../components/MyWebview'
import { fonts } from '../../utilities/fonts'
import MyInputs from '../../components/MyInputs'
import MyCheckBox from '../../components/MyCheckBox'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../utilities/icons'
import { MyButton } from '../../components/MyButton'
import openUrl from '../../functions/openUrl'
import { S3_URL } from '../../utilities/constants'
import MemberView from '../../components/MemberView'
import QuestionComponent from './Components/QuestionComponent'

const GenericQuetionList = ({ navigation, route }) => {
  const { token } = useSelector(selectUser)
  const { created_for, id: createdForId, memberId } = route?.params
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([])
  const [member, setMember] = useState(null)



  const getQuestionsListFromServer = async () => {
    let res = await QUESTIONS_LIST({
      token, navigation, body: {
        created_for: created_for,
        created_for_id: createdForId,
        member_id: memberId
      }
    })
    if (res.code == 200) {

      setList(res?.questionnaire)
      setMember(res?.member)
      // setList(firstTime ? res.questionnaire_list : [...list, ...res.questionnaire_list])
      setLoader(false)
    } else {
      setLoader(false)


    }
  }

  useEffect(() => {
    setLoader(true)
    getQuestionsListFromServer()
  }, [])



  const topView = () => {
    return (
      <View>
        {!!member &&
          <MemberView member={member} />}
      </View>
    )
  }


  return (
    <RootView titleView={topView}>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={({ item, index }) => <QuestionComponent item={item} index={index} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default GenericQuetionList;

