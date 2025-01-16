import { View,  FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_MEMBER_LIST_FOR_MISSION, } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import EmptyView from '../../../components/EmptyView'
import MyRefreshControl from '../../../components/MyRefreshControl'
import routes from '../../../navigation/routes'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import SearchView from '../../../components/SearchView'
import FooterLoader from '../../../components/FooterLoader'





const MemberList = ({ navigation, route }) => {
  const { key } = route.params
  const paging = useRef({ page: 0, canLoadMore: false })?.current;
  const { navbar } = useSelector(selectNavbar);
  const { user, token, access } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [searchText, setSearchText] = useState("")
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searching, setSearching] = useState(false);

  const onMissionList = (member) => {
    navigation.navigate(routes?.missionList, {
      member: member,
      memberId: member?._id
    })
  }


  const callAPi = () => {
    paging.canLoadMore = false;
    paging.page = 0;
    setList([])
    setLoader(true);
    getMissionMembersFromServer(true)
  }

  const loadMore = () => {
    if (paging.canLoadMore) {
      paging.canLoadMore = false;
      setFooterLoader(true);
      getMissionMembersFromServer()
    }
  }

  const onRefresh = () => {
    paging.page = 0;
    paging.canLoadMore = false;
    setRefreshing(true)
    getMissionMembersFromServer(true)
  }

  const onSearch = () => {
    paging.page = 0;
    paging.canLoadMore = false;
    setSearching(true)
    getMissionMembersFromServer(true)
  }

  const getMissionMembersFromServer = async (newArray = false) => {

    let res = await GET_MEMBER_LIST_FOR_MISSION({
      navigation, token, page: paging.page,
      search_text: searchText,
      type: memberTypeObj[access?.show_members_list_for_payment_request]
    })
    if (res.code == 200) {
      let length = newArray ? res?.members.length : list.length + res?.members.length;
      if (length < res?.total_member_count) {
        paging.page++;
        paging.canLoadMore = true;
      } else {
        paging.canLoadMore = false;
      }
      setTotal(res?.total_member_count)
      setList(newArray ? res?.members : [...list, ...res?.members]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearching(false)

    } else {
      setLoader(false)
      setFooterLoader(false);
      setRefreshing(false);
      setSearching(false)
    }
  }





  useEffect(() => {
    callAPi()
  }, [])



  const renderProgress = useCallback(({ item, index }) => {
    return (
      <Pressable onPress={() => onMissionList(item)} style={__styles.itemView}>
        <View style={{ flex: 1 }}>
          <MemberView member={item} />
        </View>
        {icons.forwardArrow()}
        {/* <StatView /> */}

      </Pressable>
    )
  }, [JSON.stringify(list)])

  const topView = () => {
    return (
      <View>
        <View style={__styles.topView}>
          <TitleView
            title={title}
            hideBackBottomButton
            subTitle={`Showing ${list.length} of ${total}`}
          />
        </View>

      </View>
    )
  }


  const headerView = (item) => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <SearchView
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearch}
          loader={searching}
        />

      </View>
    )
  }

  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
          data={list}
          renderItem={renderProgress}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Mission Report Found'} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      {/* <FAB onPress={onAddScreen} /> */}
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MemberList


const memberTypeObj = {
  "all_members": "all",
  "nurture_members": "nurture"
}


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  topView: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.darkSecondary, paddingBottom: 5
  },

})