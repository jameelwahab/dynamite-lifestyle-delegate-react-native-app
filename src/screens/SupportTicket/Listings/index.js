import { Text, View, useWindowDimensions, StyleSheet, Keyboard, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import TitleView from "../../../components/TitleView"
import { icons } from '../../../utilities/icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import ListView from './ListView';
import { fonts } from '../../../utilities/fonts';
import Modal from 'react-native-modal'
import { INETRNAL_TCIKETS_LIST_BY_TYPE, LIST_OF_DEPARTMENTS, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import debounce from '../../../functions/debounce';
import MyInputs from '../../../components/MyInputs';
import RNFetchBlob from 'react-native-blob-util';
import showToast from "../../../functions/showToast"
import moment from "moment"
import { dateTimeFormat } from "../../../utilities/constants"






const TicketsList = ({ navigation, route }) => {
  const paging = useRef({ page: 0, canLoadMore: false });
  const { type } = route?.params;
  const isInternalTicket = type == "internal_ticket";
  const isSupportTicket = type == "support_ticket";
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
    if (paging?.current?.canLoadMore) {
      paging.current.canLoadMore = false;
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
        page: paging?.current?.page,
        body: {
          filter_by: routes[index].key
        },
        searchText: searchText.trim(),
        token,
        navigation
      })
    } else if (type == "internal_ticket") {
      res = await INETRNAL_TCIKETS_LIST_BY_TYPE({
        page: paging?.current?.page,
        body: {
          filter_by: routes[index].key
        },
        searchText: searchText.trim(),
        token,
        navigation
      })
    }


    if (res?.code == 200) {
      let count = paging.current.page == 0 ? res?.support_ticket.length : (res?.support_ticket.length + list.length)
      // paging.current.page++;
      console.log(count,res?.total_count,"Check")
      if (count < res?.total_count) {
        paging.current.page++;
        paging.current.canLoadMore = true
      } else {
        paging.current.canLoadMore = false
      }
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
    paging.current.page = 0;
    setList([])
    setLoader(index)
    debounce(() => getSupportTickets(false, false))
  }

  useEffect(() => {
    debounce(() => {
      paging.current.page = 0;
      paging.current.canLoadMore = false;
      setList([])
      setLoader(index)
      getSupportTickets(false, false)
    })
  }, [searchText, index])




  const searchView = useCallback(() => {
    return (
      <View style={{ marginVertical: -10, backgroundColor: colors.darkSecondary }}>
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
            {((route?.key == 'need_fixes' && badges['need_to_fixed_dot'] > 0) || (
              ((user?.is_sidebar_notify && isSupportTicket) || (user?.is_internal_ticket_notify && isInternalTicket)) &&
              user?.notify_tab == 'need_to_attention' && route?.key == "needs_to_attention" ||
              user?.notify_tab == route?.key)) &&
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
      setList={setList}
      active={index == route.index}
      isLoadingMore={footerLoader == route.index}
      loadMore={loadMore}
      type={type}
    />
  }

  function DateFormatorForCsv(date) {
    if (!!date)
      return moment(date).format(dateTimeFormat.dateTime.split(' ')[0]);
    else return "N/A";
  }


  function makeCsv() {
    let file = "";
    let header = `First Name,Last Name,Email,Subject,Department,Status,Created Date,Responded Date,${((isSupportTicket && index == 6) || (isInternalTicket && index == 3)) ? "Resolved Date," : ""}Description\n`;



    list.forEach((x, i) => {
      file += `${x?.member?.first_name}, ${x?.member?.last_name}, ${x?.member?.email}, ${x.subject}, ${x?.department?.title},${tabs[type][index].key}, ${DateFormatorForCsv(x?.createdAt)},${!!x?.last_action_date ? DateFormatorForCsv(x?.last_action_date) : "N/A"},${((isSupportTicket && index == 6) || (isInternalTicket && index == 3)) ? DateFormatorForCsv(x?.resolve_date) + "," : ""}  "${x?.description.replaceAll("\n", " ")}"\n`;
    })
    file = header + file;
    const pathToWrite =
      Platform.OS == "ios" ?
        `${RNFetchBlob.fs.dirs.DocumentDir}/CSV/${type + "_" + tabs[type][index].key}.csv` :
        `${RNFetchBlob.fs.dirs.DownloadDir}/CSV/${type + "_" + tabs[type][index].key}.csv`;

    RNFetchBlob.fs
      .writeFile(pathToWrite, file, 'utf8')
      .then(async (res) => {
        if (Platform.OS == "android") {
          let result = await RNFetchBlob.MediaCollection.copyToMediaStore({
            name: `${type + "_" + tabs[type][index].key}.csv`,
            parentFolder: 'Mission Control',
            mimeType: 'text/csv'
          },
            'Download',
            pathToWrite
          );
          showToast({ title: "CSV File Downloaded", type: "success" })
        } else if (Platform.OS == "ios") {
          showToast({ title: "CSV File Downloaded", type: "success" })
        }
      })
      .catch(error => console.error(error));

  }

  function titleView() {
    return (
      <View style={__styles.topView}>
        <TitleView
          hideBackBottomButton
          title={type == "support_ticket" ? 'Support Tickets' : type == "internal_ticket" ? "Internal Tickets" : ""}
        />
        {list.length != 0 && <TouchableOpacity
          disabled={!loader}
          onPress={() => makeCsv()}
          style={__styles.headerBtn} >
          <Image source={icons.csv} style={{ height: 12, aspectRatio: 1.5 }} />
        </TouchableOpacity>}

      </View>
    )
  }

  return (
    <RootView
      rightButtonIcon={icons.handPromise}
      hideBackBottomButton={true}
      titleView={titleView}
    >
      {searchView()}
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            paging.current.canLoadMore = false
            paging.current.page = 0;
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
  },
  topView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkSecondary,
    marginHorizontal: 10,
  },
  headerBtn: {
    height: 25,
    width: 25,
    borderRadius: 28 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    backgroundColor: colors.primary,
  },
})

