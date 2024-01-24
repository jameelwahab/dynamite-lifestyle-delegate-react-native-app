import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { MEMBER_QUESTIONS_MODULE_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import debounce from '../../../functions/debounce'
import EmptyView from '../../../components/EmptyView'
import StatView from '../Components/StatView'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import FooterLoader from '../../../components/FooterLoader'

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
    getQuestionsListFromServer(true)
  }, [])

  const renderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.genericQestionListing, {
            created_for: item?.created_for,
            id: item?._id,
            memberId: memberId
          })
        }}
        style={{ backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10, padding: 10 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
          <MyText color={colors.primary} >{(index + 1) + "."}</MyText>
        </View>
        <StatView title={"Questions Created For"} value={item?.created_for.replace(/_/g, " ").replace(/-/g, " ")} />
        <StatView title={"Module Title"} value={!!item?.created_for_id?.title ? item?.created_for_id?.title : "N/A"} />
        <StatView title={"Answered Date"} value={moment(item?.reply_date).format(dateTimeFormat.date)} />
      </TouchableOpacity>
    )
  }

  return (
    <RootView title="Questions Answers List">
      <FlatList
        data={list}
        renderItem={renderList}
        ListEmptyComponent={!loader && <EmptyView />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        onEndReached={() => {
          if (canLoadMore) {
            canLoadMore = false;
            setFooterLoader(true);
            getQuestionsListFromServer(false);
          }
        }}

      />
    </RootView>
  )
}

export default QuestionsList