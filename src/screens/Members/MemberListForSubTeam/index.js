import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MemberView from '../../../components/MemberView'
import { colors } from '../../../utilities/colors'
import FooterLoader from '../../../components/FooterLoader'
import MyRefreshControl from '../../../components/MyRefreshControl'
import EmptyView from '../../../components/EmptyView'
import { GET_MEMBER_LISTING_FOR_SUB_TEAM, IS_CHAT_EXIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import StatView from '../Components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import { icons } from '../../../utilities/icons'
import SearchView from '../../../components/SearchView'

const MemberListForSubTeam = ({ navigation, route }) => {
  const { token, user, isChatAllowed, access } = useSelector(selectUser)
  const pagination = useRef({ page: 0, canLoadMore: false });
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(false)
  const [total, setTotal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoader, setSearchLoader] = useState(false)

  useEffect(() => {
    callAPi?.()
  }, [])

  const callAPi = () => {
    pagination.current = {
      canLoadMore: false,
      page: 0,
    }
    setList([])
    setLoader(true);
    getMembersFromServer(true)
  }

  const onSearchPress = () => {
    setSearchLoader(true);
    pagination.current = {
      canLoadMore: false,
      page: 0,
    }
    getMembersFromServer(true)
  }
  const loadMore = () => {
    if (pagination?.current?.canLoadMore) {
      pagination.current.canLoadMore = false;
      setFooterLoader(true);
      getMembersFromServer()
    }
  }

  const onRefresh = () => {
    pagination.current = {
      canLoadMore: false,
      page: 0,
    }
    setRefreshing(true)
    getMembersFromServer(true)
  }
  const onProfileScreen = (item) => {
    if (access?.view_profile) {
      navigation.navigate(routes?.memberProfile, {
        memberId: item?._id
      })
    }
  }

  const onChatScreen = async (memberId) => {
    let res = await IS_CHAT_EXIST({ token, navigation, memberId })
    if (res.code == 200) {
      if (res.is_chat_exist) {
        let member = res.chat.member.find(x => x._id != user?._id)
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: "",
          profileImage: !!member?.profile_image ? member?.profile_image : "",
          chatId: res?.chat?._id,
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      } else {
        let member = res.user_info;
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: !!member?.last_login_activity ? member?.last_login_activity : "",
          profileImage: !!member?.member ? member?.member : "",
          chatId: "",
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      }
    }
  }

  const getMembersFromServer = async (newArray = false) => {
    let res = await GET_MEMBER_LISTING_FOR_SUB_TEAM({
      navigation, token, page: pagination?.current?.page, searchText: searchText
    })
    if (res.code == 200) {
      let length = newArray ? res?.event_subscriber.length : list.length + res?.event_subscriber.length;
      if (length < res?.total_count) {
        pagination.current.page++
        pagination.current.canLoadMore = true;
      } else {
        pagination.current.canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.event_subscriber : [...list, ...res?.event_subscriber]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    }
  }

  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <SearchView
          onChangeText={(text) => setSearchText(text)}
          search={searchText}
          loader={searchLoader}
          onSearchPress={onSearchPress}
        />
      </View>
    )
  }


  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >
          {value ? "Active" : "Inactive"}
        </MyText>
      </View>)
  }



  const renderBookings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.headerView}>
          <Pressable onPress={() => onProfileScreen(item)} >
            <MemberView member={item} marginLeft={0} size={35} titleSize={14} />
          </Pressable>

          {isChatAllowed &&
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => onChatScreen(item?._id)}>
              {icons.message(colors.primary, 20)}
            </TouchableOpacity>}
        </View>
        <View>
          {/* <StatView title={"Booking Page"} value={!!item?.page?.sale_page_title ? item?.page?.sale_page_title : "N/A"} /> */}
          <StatView title={"Registeration Date"} value={`${moment(item?.createdAt).format(dateTimeFormat.date)}`} uppercase />
          <StatView title={"Booking Status"} view={() => statusView(item?.status)} />
        </View>
      </View>
    )
  }

  return (
    <RootView hideBackBottomButton title='Members'
      subTitle={`Showing ${list.length} of ${total}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={renderBookings}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Members'} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MemberListForSubTeam


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusView: {
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    height: 25,
    paddingHorizontal: 10,
    // minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "flex-start"
  },

  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },
  topBtnsView: { flexDirection: "row", alignItems: "flex-end", },

  sortBtn: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  }
})