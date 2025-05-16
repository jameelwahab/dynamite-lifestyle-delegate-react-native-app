import { View, FlatList, StyleSheet, Pressable, TouchableOpacity, Keyboard } from 'react-native'
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
import MyText from '../../../components/MyText'
import MyRefreshControl from '../../../components/MyRefreshControl'
import routes from '../../../navigation/routes'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import SearchView from '../../../components/SearchView'
import FooterLoader from '../../../components/FooterLoader'
// import StatView from '../../Members/Components/StatView'
import { Flex, Row } from '../../../UIComponents/FlexViews'
import { convertTimezone2 } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { dateTimeFormat } from '../../../utilities/constants'
import MyChip from "../../../components/MyChip"
import MyImage from '../../../components/MyImage'
import ImgAndTxt from '../../../components/ImgAndTxt'
import StatView from '../../../components/StatView'





const MemberList = ({ navigation, route }) => {
  const { parentValue, value, type } = route.params
  console.log(parentValue, "parentValue")
  const isCompleted = type == "completed";
  const paging = useRef({ page: 0, canLoadMore: false })?.current;
  const { navbar } = useSelector(selectNavbar);
  const { user, token, access } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [searchText, setSearchText] = useState("")
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searching, setSearching] = useState(false);

  const onMissionList = (item) => {
    navigation.navigate(routes?.missionReportScreen, {
      missionId: item?.mission_info?._id,
      memberId: item?.member?._id,
      type: route.params.type,
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
    Keyboard.dismiss()
    paging.page = 0;
    paging.canLoadMore = false;
    setSearching(true)
    getMissionMembersFromServer(true)
  }

  const getMissionMembersFromServer = async (newArray = false) => {

    let res = await GET_MEMBER_LIST_FOR_MISSION({
      navigation, token, page: paging.page,
      search_txt: searchText,
      type: memberTypeObj[access?.show_members_list_for_payment_request],
      mission_type: type,
      body: {
        to_day: filter?.to,
        mission_id: filter?._id,
        from_day: filter?.from
      },
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
  }, [filter])

  useEffect(() => {
    setFilter(route?.params?.filter)
  }, [route])

  const filterTheData = (obj) => {
    setFilter(obj);
  }
  const onFilterScreen = () => {
    navigation.navigate(routes.missionMembersFilterScreen, { filter, filter })
  }

  const renderProgress = useCallback(({ item, index }) => {
    return (
      <Pressable onPress={() => onMissionList(item)} style={__styles.itemView}>
        <Row alignItems="center" >
          <Flex flex={1}>
            <MemberView
              member={item?.member}
              borderColor={item?.current_badge_level?.color_code}
            />
          </Flex>
          {icons.forwardArrow()}
        </Row>
        {/* <StatView title={"Badge Level"} value={item?.mission_info?.membership_level_info?.badge_level_info?.title} /> */}
        <StatView title={"Mission Title"} value={item?.mission_info?.title} original />
        <StatView title={"Duration"} value={item?.mission_duration + " days"} />

        <StatView title={"Accept Time Badge"} view={() =>
          <ImgAndTxt img={item?.accept_time_badge_details?.icon?.thumbnail_1} txt={item?.accept_time_badge_details?.title} />
        } />

        <StatView title={"Current Badge"} view={() => <ImgAndTxt img={item?.current_badge_level?.icon?.thumbnail_1} txt={item?.current_badge_level?.title} />} />

        <StatView title={"Coins Earned"} value={item?.mission_attracted_coins} />
        <StatView title={"Achievable Coins"} value={item?.mission_reward_coins} />
        <StatView title={"Start Date"} value={convertTimezone2(item?.mission_start_date, timezone).format(dateTimeFormat.date)} />
        {isCompleted &&
          <StatView title={"Completed Date"} value={convertTimezone2(item?.mission_completed_date, timezone).format(dateTimeFormat.date)} />}
      </Pressable>
    )
  }, [JSON.stringify(list)])

  const topView = () => {
    return (
      <View >
        <View style={__styles.topView}>
          <TitleView
            title={`${title} Report`}
            hideBackBottomButton
            subTitle={`Showing ${list.length} of ${total}`}
          />
          {type == "in_progress" &&
            <TouchableOpacity
              onPress={onFilterScreen}
              style={__styles.filterButton}
              hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}>
              {icons.filterCircle(colors.primary, 30)}
            </TouchableOpacity>}
        </View>


        <View style={{ flexDirection: 'row' }}>
          {!!filter?.from && filter?.to &&
            <MyChip
              onPress={() => filterTheData({})}
              title={filter?.title}
            />
          }

          {!!filter?.from && filter?.to &&
            <MyChip
              onPress={() => filterTheData({})}
              title={`Days: ${filter?.from}-${filter?.to}`}
            />}
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
          keyboardShouldPersistTaps="handled"
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
  },
  topView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5
  },
  filterButton: {
    height: "100%",
    justifyContent: "center",
    // width: 50,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    // paddingHorizontal: 15,
    // paddingVertical: 8
  },

})
