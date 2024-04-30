import { View, FlatList, useWindowDimensions, } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyLoader from '../../../components/MyLoader'
import { QUESTIONS_LIST, TOGGLE_SHOW_REPLIES } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import EmptyView from '../../../components/EmptyView'
import MemberView from '../../../components/MemberView'
import QuestionComponent from '../../Questions/Components/QuestionComponent'
import QuestionView from './QuestionView'
import { TabBar, TabView } from 'react-native-tab-view'
import RepliesView from './RepliesView'
import { colors } from '../../../utilities/colors'
import MyText from '../../../components/MyText'
// import QuestionComponent from './Components/QuestionComponent'


const SelfImageDetail = ({ navigation, route }) => {
  const { token, user } = useSelector(selectUser);
  const layout = useWindowDimensions();
  const { created_for, id: createdForId, memberId } = route?.params
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([])
  const [member, setMember] = useState(null)
  const [myTabs] = useState([
    { key: 'questions', title: 'Questions', index: 0 },
    { key: 'replies', title: `${user?.first_name}'s Reply`, index: 1 }]);
  const [index, setIndex] = useState(0);
  const [replies, setReplies] = useState([])

  const onShowReplyPress = async (question) => {
    setLoader(true);
    let val = !!!question?.answer?.show_replies;
    let body = {
      created_for: created_for,
      question_id: question?._id,
      member_id: memberId,
      show_replies: val
    }
    let res = await TOGGLE_SHOW_REPLIES({ token, navigation, body });
    if (res.code == 200) {

      setLoader(false);
      setList((old) => {
        let index = old.findIndex(x => x._id == question?._id);
        if (index > -1) {
          let newQuestion = {
            ...old[index], answer: {
              ...old[index].answer,
              show_replies: val
            }
          }
          old.splice(index, 1, newQuestion);
        }
        return [...old];
      })
    } else {

      setLoader(false);

    }
  }

  const getQuestionsListFromServer = async () => {
    let res = await QUESTIONS_LIST({
      token, navigation, body: {
        created_for: created_for,
        created_for_id: createdForId,
        member_id: memberId,
        check_user: true
      }
    })
    if (res.code == 200) {

      setList(res?.questionnaire)
      setMember(res?.member)
      setReplies(res?.self_image_replies)
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


  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => {
        return (
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title}
          </MyText>
        )
      }}
      gap={10}
    />
  );

  const renderScene = ({ route, }) => {
    switch (route.key) {
      case 'questions':
        return <QuestionView list={list} loader={loader} onShowReplyPress={onShowReplyPress} member={member}
          refresh={getQuestionsListFromServer} />
      case 'replies':
        return <RepliesView
          list={replies}
          loader={loader}
          navigation={navigation}
          refresh={getQuestionsListFromServer}
          token={token} />
    }
  }




  const topView = () => {
    return (
      <View>
        {!!member && <MemberView member={member} />}
      </View>
    )
  }


  return (
    <RootView titleView={topView}>
      {/* <QuestionView list={list} loader={loader} /> */}
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes: myTabs }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: layout.width }}
        />
      </View>
      <MyLoader enable={loader} />

    </RootView>
  )
}

export default SelfImageDetail;

