import { View, Text, FlatList } from 'react-native'
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

const GenericQuetionList = ({ navigation, route }) => {
  const { token } = useSelector(selectUser)
  const { created_for, id: createdForId, memberId } = route?.params
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([])



  const getQuestionsListFromServer = async () => {
    let res = await QUESTIONS_LIST({
      token, navigation, body: {
        created_for: created_for,
        created_for_id: '',
        member_id: memberId
      }
    })
    if (res.code == 200) {

      setList(res?.questionnaire)
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


  const renderQuestionList = ({ item, index }) => {
    console.log(item, "item")
    return (
      <View style={{ backgroundColor: colors.secondary, padding: 5, marginTop: 10, borderRadius: 10 }}>
        <MyText>{"Question Statement"}</MyText>
        <View style={{marginTop:5}}>
          <MyWebview fullWidth html={item?.question_statement} />
        </View>
      </View>
    )
  }


  return (
    <RootView>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={renderQuestionList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default GenericQuetionList