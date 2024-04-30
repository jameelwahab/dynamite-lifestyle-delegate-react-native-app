import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GOAL_STATEMENT_DETAIL } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import MyRefreshControl from '../../components/MyRefreshControl'
import { colors } from '../../utilities/colors'
import MemberView from '../../components/MemberView'
import { icons } from '../../utilities/icons'
import Collapsible from 'react-native-collapsible'
import { MyButton } from '../../components/MyButton'
import EmptyView from '../../components/EmptyView'
import ImageSwiper from '../../components/ImageSwiper'
import ReplyModal from './components/ReplyModal'
import AnswerHistoryModal from './components/AnswerHistoryModal'
import { TabBar, TabView } from 'react-native-tab-view'
import List from './components/List'

const GoalstatmentDetail = ({ navigation, route }) => {
  const { memberId } = route?.params;
  const ref_replyModal = useRef();
  const ref_historyModal = useRef();
  const layout = useWindowDimensions();
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [notCollapsed, setNotCollapsed] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([]);
  const [member, setMember] = useState(null);
  const [galleryList, setGalleryList] = useState([])
  const [myTabs] = useState([
    { key: 'gallery', title: 'Gallery', index: 0 },
    { key: 'replies', title: `${user?.first_name}'s Reply`, index: 1 }]);
  const [index, setIndex] = useState(0);
  const [replies, setReplies] = useState([])

  useEffect(() => {
    getDataFromServer();
  }, [])


  const ammendQuestion = (question) => {
    let index = list.findIndex(x => x._id === question._id);
    if (index > -1) {
      list.splice(index, 1, question);
      setList([...list]);
    }
  }

  const onRefresh = () => {
    setRefreshing(false);
    getDataFromServer()
  }

  //! APIs
  const getDataFromServer = async () => {
    let res = await GOAL_STATEMENT_DETAIL({ navigation, token, memberId });
    if (res.code == 200) {
      setList(res?.goal_statement_question);
      setGalleryList(res?.goal_statement_gallery);
      setReplies(res?.reply)
      setMember(res?.member)
      setLoader(false)
      setRefreshing(false);
      if (!!res?.goal_statement_question[0]) {
        setNotCollapsed(res?.goal_statement_question[0]?._id)
      }
    } else {
      setLoader(false)
      setRefreshing(false);
    }
  }


  //*  Views


  const headview = () => {
    return (
      <View>
        {galleryList.length == 0 && !loader ?
          <EmptyView
            label={"Member has not added any goal statement gallery yet"}
          /> :
          <ImageSwiper list={galleryList} />}
      </View>
    )
  }

  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <Pressable
          onPress={() => setNotCollapsed(item?._id)}
          style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <MyText>{item?.question}</MyText>
          </View>
          <View style={{ marginTop: 2 }}>
            {notCollapsed != item?._id ? icons.downwardArrow() : icons.upwardArrow()}
          </View>
        </Pressable>
        <Collapsible collapsed={notCollapsed != item?._id} >
          <View>
            {!!item?.answer &&
              <View>
                <MyText color={colors.lightText} >{item?.answer}</MyText>
              </View>}

            <View style={__styles.btnRow}>

              <MyButton
                title='Answer History'
                invert
                style={__styles.btn}
                onPress={() => ref_historyModal?.current?.open(item)}
              />

              <MyButton
                title={`Reply (${item?.comment.length})`}
                invert
                style={__styles.btn}
                onPress={() => ref_replyModal?.current?.open(item)}

              />
            </View>
          </View>
        </Collapsible>

      </View>
    )
  }

  const topView = () => {
    return (
      <View style={__styles.topRow}>
        <View style={{ flex: 1 }}>
          {!!member && <MemberView member={member} />}
        </View>
        {/* <TouchableOpacity
          style={__styles.iconBtn}>
          {icons.message(colors.primary, 20)}
        </TouchableOpacity> */}
      </View>
    )
  }

  const galleryView = () => {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <FlatList
          ListHeaderComponent={headview()}
          data={list}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />}
          renderItem={renderList}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }


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
      case 'gallery':
        return galleryView()
      case 'replies':
        return <List list={replies} refresh={getDataFromServer} />
    }
  }


  return (
    <RootView titleView={topView} >

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
      <ReplyModal
        ref={ref_replyModal}
        member={member}
        token={token}
        navigation={navigation}
        setBackQuestion={ammendQuestion}
      />

      <AnswerHistoryModal
        ref={ref_historyModal}
        member={member}
        token={token}
        navigation={navigation}
      />
    </RootView>
  )
}

export default GoalstatmentDetail


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: "row",
  },
  btnRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  btn: {
    paddingHorizontal: 10,
    height: 35
  },
  iconBtn: {
    paddingTop: 3,
    paddingRight: 10,
  }
})