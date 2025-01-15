import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { BOOKING_DELETE, GET_ASSESSMENT_LIST, GET_BOOKINGS_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import MemberView from '../../components/MemberView'
import { MenuButton } from '../../components/MyButton'
import moment from 'moment'
import {  dateTimeFormat } from '../../utilities/constants'
import FooterLoader from '../../components/FooterLoader'
import EmptyView from '../../components/EmptyView'
import MyRefreshControl from '../../components/MyRefreshControl'
import FAB from '../../components/FAB'
import routes from '../../navigation/routes'
import TitleView from '../../components/TitleView'
import { icons } from '../../utilities/icons'
import SearchView from '../../components/SearchView'
import OptionModal from '../../components/OptionModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import StatView from '../../components/StatView'
import { convertTimezone } from '../../functions/convertTime'
import { selectTimeZone } from '../../redux/reducers/timezoneSlice'





let page = 0;
let canLoadMore = false;
const Bookings = ({ navigation, route }) => {

  const { key } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone)
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null, list: [] });



  useEffect(() => {
    callAPi()
  }, [])



  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null, })
    if (opt.key == "history") {
      onDetail(item)
    }
  }

  const onDetail = (item) => {
    navigation.navigate(routes.assessmentDetail, {
      item: item,
    })
  }
  const openOptions = (item) => {
    setOptionModal({ isVisible: true, item: item, })
  }





  const onSearchPress = () => {
    canLoadMore = false;
    page = 0;
    setSearchLoader(true);
    getBookingsFromServer(true)
  }




  const callAPi = () => {
    canLoadMore = false;
    page = 0;
    setList([])
    setLoader(true);
    getBookingsFromServer(true)
  }

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getBookingsFromServer()
    }
  }

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true)
    getBookingsFromServer(true)
  }

  const getBookingsFromServer = async (newArray = false) => {


    let res = await GET_ASSESSMENT_LIST({ navigation, token, page, searchText })
    if (res.code == 200) {
      let length = newArray ? res?.assessment.length : list.length + res?.assessment.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.assessment : [...list, ...res?.assessment]);
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




  const renderBookings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.headerView}>
          <Pressable onPress={() => onDetail(item)}>
            <MemberView member={item?.member} marginLeft={0} size={35} titleSize={14} />
          </Pressable>
          <MenuButton
            onPress={() => openOptions(item, index)}
          />
        </View>
        <View>
          <StatView title={"Attitude Coins"} value={!!item?.attitude_assessment_coins_count ? item?.attitude_assessment_coins_count : "N/A"} />
          <StatView title={"Delegate"} value={!!item?.consultant ? item?.consultant?.first_name + " " + item?.consultant?.last_name : "N/A"} />
          <StatView title={"Nurture"} value={!!item?.nurture ? item?.nurture?.first_name + " " + item?.nurture?.last_name : "N/A"} />
          <StatView title={"Completed Date"} value={convertTimezone(item?.activity_date_time, timezone).format(dateTimeFormat.dateTime)} uppercase />
          <StatView title={"Assessment Level"} value={item?.badge_level_info?.membership_level_badge_title} original />
        </View>
      </View>
    )
  }

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


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>

        <SearchView
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearchPress}
          loader={searchLoader}
          search={searchText}
        />
      </View>
    )
  }

  return (
    <RootView hideSubHeader>
      {topView()}
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
          ListEmptyComponent={!loader && !refreshing && <EmptyView />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptionModal({ isVisible: false, item: null, list: [] })}
      />



    </RootView>
  )
}

export default Bookings
const optionsList = [

  {
    title: "View History",
    key: "history",
    icon: icons.edit
  },

]



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