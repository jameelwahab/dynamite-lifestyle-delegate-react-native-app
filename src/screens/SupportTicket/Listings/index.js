import { Text, View, useWindowDimensions, StyleSheet, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { icons } from '../../../utilities/icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import ListView from './ListView';
import { fonts } from '../../../utilities/fonts';
import MyInputs from '../../../components/MyInputs';
import Modal from 'react-native-modal'
import { INETRNAL_TCIKETS_LIST_BY_TYPE, LIST_OF_DEPARTMENTS, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import debounce from '../../../functions/debounce';





let page = 0;
let totalPage = 0;
let canLoadMore = false;


const TicketsList = ({ navigation, route }) => {
  const { type } = route?.params
  const layout = useWindowDimensions();
  const { token, user } = useSelector(selectUser);
  const [index, setIndex] = React.useState(0);
  const [loader, setLoader] = React.useState(0);
  const [footerLoader, setFooterLoader] = React.useState(-1);
  const [list, setList] = useState([])
  const [depList, setDepList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [badges, setbadges] = useState({
    waiting: 0,
    answered: 0,
    need_fixes: 0,
    need_to_fixed_dot: 0,
    needs_to_attention: 0,
    reminder: 0,
    ready_to_close: 0,
    closed: 0,
    trash: 0,

  })
  const [routes] = React.useState(tabs[type]);


  const loadMore = () => {
    console.log("loadMore", canLoadMore)
    if (canLoadMore) {
      canLoadMore = false;
      getSupportTickets(false, true);
    }
  }

  const getSupportTickets = async (loading = true, isLoadingMore = false) => {
    if (isLoadingMore) {
      setFooterLoader(index)
    }
    else if (loading) {
      setLoader(index)
    }
    if (!isLoadingMore) {
      setList([])
    }

    let res;
    if (type == "support_ticket") {
      res = await SUPPORT_TCIKETS_LIST_BY_TYPE({
        page: page,
        body: {
          filter_by: routes[index].key
        },
        searchText: searchText.trim(),
        token,
        navigation
      })
    } else if (type == "internal_ticket") {
      res = await INETRNAL_TCIKETS_LIST_BY_TYPE({
        page: page,
        body: {
          filter_by: routes[index].key
        },
        searchText: searchText.trim(),
        token,
        navigation
      })
    }


    if (res?.code == 200) {
      console.log(page, "page1")
      page++;
      console.log(page, "page2")
      console.log((page > (res?.total_pages - 1)), page, res?.total_pages, "CHECK")
      if (page > (res?.total_pages - 1)) {
        canLoadMore = false
      } else {
        canLoadMore = true
      }
      console.log(page, "page3")
      console.log(canLoadMore, "canLoadMore")
      setLoader(-1)
      setFooterLoader(-1)
      if (isLoadingMore) {
        setList([...list, ...res?.support_ticket]);
      } else {
        setList(res?.support_ticket);
      }
      setbadges({
        waiting: !!res?.waiting_ticket_count ? res?.waiting_ticket_count : 0,
        answered: !!res?.answered_ticket_count ? res?.answered_ticket_count : 0,
        need_fixes: !!res?.need_fixes_count ? res?.need_fixes_count : 0,
        need_to_fixed_dot: !!res?.need_to_fix_reminder_count ? res?.need_to_fix_reminder_count : 0,
        needs_to_attention: !!res?.need_to_attention_count ? res?.need_to_attention_count : 0,
        reminder: !!res?.reminder_ticket_count ? res?.reminder_ticket_count : 0,
        ready_to_close: !!res?.ready_to_close_count ? res?.ready_to_close_count : 0,
        solved: !!res?.solved_ticket_count ? res?.solved_ticket_count : 0,
        trash: !!res?.trash_ticket_count ? res?.trash_ticket_count : 0,
      })
    } else {
      setFooterLoader(-1)
      setLoader(-1)
    }
  }




  const listOfDepartments = async () => {
    let res = await LIST_OF_DEPARTMENTS({
      token,
      navigation
    })
    if (res.code == 200) {
      setDepList(res.department)
    }
  }



  useEffect(() => {
    if (type == "support_ticket") {
      listOfDepartments()
    }
  }, [])

  const refresh = () => {
    page = 0;
    setList([])
    setLoader(index)
    debounce(() => getSupportTickets(false, false))
  }

  useEffect(() => {
    debounce(() => {
      page = 0;
      canLoadMore = false;
      setList([])
      setLoader(index)
      getSupportTickets(false, false)
    })
  }, [searchText, index])




  const searchView = useCallback(() => {
    return (
      <View style={{ marginHorizontal: 10, backgroundColor: colors.darkSecondary }}>
        <MyInputs
          leftIcon={icons.search}
          placeholder='Search...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          rightIcon={!!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon}
          rightIconOnPress={() => {
            Keyboard.dismiss()
            setSearchText("")
          }}
        />
      </View>
    )
  }, [searchText])



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
          <>
            <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
              {route.title + " (" + badges[route?.key] + ")"}
            </MyText>
            {((route?.key == 'need_fixes' && badges['need_to_fixed_dot'] > 0) ||
              user?.notify_tab == 'need_to_attention' && route?.key == "needs_to_attention" ||
              user?.notify_tab == route?.key) &&
              <View style={__styles.badges} />
            }
          </>
        )
      }}
      gap={10}
    />
  );

  const renderScene = ({ route }) => {
    return <ListView
      user={user}
      refresh={refresh}
      token={token}
      route={route?.key}
      list={index == route.index ? list : []}
      departmentList={depList}
      isLoading={loader == route.index}
      setLoader={setLoader}
      active={index == route.index}
      isLoadingMore={footerLoader == route.index}
      loadMore={loadMore}
      type={type}
    />
  }






  return (
    <RootView
      rightButtonIcon={icons.handPromise}
      hideBackBottomButton={true}
      title={type == "support_ticket" ? 'Support Tickets' : type == "internal_ticket" ? "Internal Tickets" : ""}
    >
      {searchView()}
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            canLoadMore = false
            page = 0;
            setIndex(index);
            setList([])
            setLoader(index)
          }}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </RootView>
  )

}

export default TicketsList;

const tabs = {
  support_ticket: [
    { key: 'waiting', title: 'WAITING', index: 0 },
    { key: 'answered', title: 'ANSWERED', index: 1 },
    { key: 'need_fixes', title: 'NEEDS FIXES', index: 2 },
    { key: 'needs_to_attention', title: 'NEEDS ATTENTION', index: 3 },
    { key: 'reminder', title: 'REMINDERS', index: 4 },
    { key: 'ready_to_close', title: 'READY TO CLOSE', index: 5 },
    { key: 'solved', title: 'CLOSE', index: 6 },
    { key: 'trash', title: 'TRASH', index: 7 },
  ],
  internal_ticket: [
    { key: 'waiting', title: 'WAITING', index: 0 },
    { key: 'answered', title: 'ANSWERED', index: 1 },
    { key: 'needs_to_attention', title: 'NEEDS ATTENTION', index: 2 },
    { key: 'solved', title: 'SOLVED', index: 3 },
  ]
}

const __styles = StyleSheet.create({
  badges: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.delete,
    position: "absolute",
    top: -8,
    right: -10
  }
})

