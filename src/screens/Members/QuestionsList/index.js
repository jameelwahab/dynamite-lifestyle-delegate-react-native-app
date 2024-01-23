import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { MEMBER_QUESTIONS_MODULE_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import debounce from '../../../functions/debounce'

let page = 0;
let canLoadMore = false
const QuestionsList = ({ navigation, route }) => {
  let { token } = useSelector(selectUser);
  const { memberId } = route?.params
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [list, setList] = useState([])


  const getQuestionsListFromServer = async (firstTime = false) => {
    let res = await MEMBER_QUESTIONS_MODULE_LIST({ token, navigation, memberId: memberId, })
    if (res.code == 200) {

      let listLength = firstTime ? (0 + res.questionnaire_list) : (list.length + res.questionnaire_list);
      if (res?.total_count > listLength) {
        page = page + 1;
        canLoadMore = true
      } else {
        canLoadMore = false
      }
      setList(firstTime ? res.questionnaire_list : [...list, ...res.questionnaire_list])
      setLoader(false)
      setFooterLoader(false)
    } else {
      setLoader(false)
      setFooterLoader(false)

    }
  }

  useEffect(() => {
    setLoader(true)
    debounce(() => getQuestionsListFromServer(true), 200);
  }, [])


  return (
    <RootView>
      <MyText>Questions</MyText>
    </RootView>
  )
}

export default QuestionsList