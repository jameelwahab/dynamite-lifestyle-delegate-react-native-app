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
import { LIST_OF_DEPARTMENTS, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import debounce from '../../../functions/debounce';





let page = 1;
let totalPage = 0;
let canLoadMore = false;


const TicketsList = ({ navigation }) => {
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
  const [routes] = React.useState([
    { key: 'waiting', title: 'WAITING', index: 0 },
    { key: 'answered', title: 'ANSWERED', index: 1 },
    { key: 'need_fixes', title: 'NEEDS FIXES', index: 2 },
    { key: 'needs_to_attention', title: 'NEEDS ATTENTION', index: 3 },
    { key: 'reminder', title: 'REMINDERS', index: 4 },
    { key: 'ready_to_close', title: 'READY TO CLOSE', index: 5 },
    { key: 'solved', title: 'CLOSE', index: 6 },
    { key: 'trash', title: 'TRASH', index: 7 },
  ]);


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
    let res = await SUPPORT_TCIKETS_LIST_BY_TYPE({
      page: page - 1,
      body: {
        filter_by: routes[index].key
      },
      searchText: searchText.trim(),
      token,
      navigation
    })

    if (res.code == 200) {
      page++;
      console.log(page >= res?.total_pages, page, res?.total_pages, "CHECK")
      if (page > res?.total_pages) {
        canLoadMore = false
      } else {
        canLoadMore = true
      }
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
    listOfDepartments()
  }, [])

  const refresh = () => {
    page = 1;
    setList([])
    setLoader(index)
    debounce(() => getSupportTickets(false, false))
  }

  useEffect(() => {
    debounce(() => {
      page = 1;
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
      style={{ backgroundColor: colors.darkSecondary, }}
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => (
        <>
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title + " (" + badges[route?.key] + ")"}
          </MyText>
          {((route?.key == 'need_fixes' && badges['need_to_fixed_dot'] > 0) ||
            user?.notify_tab == route?.key) &&
            <View style={__styles.badges} />
          }
        </>
      )}
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
    />
  }






  return (
    <RootView
      rightButtonIcon={icons.handPromise}
      hideBackBottomButton={true}
      title='Support Tickets'
    >
      {searchView()}
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

    </RootView>
  )

}

export default TicketsList

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

