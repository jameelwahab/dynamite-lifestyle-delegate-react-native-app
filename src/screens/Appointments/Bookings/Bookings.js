import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_BOOKINGS_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import { MenuButton } from '../../../components/MyButton'
import StatView from '../../Members/Components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'



let page = 0;
let canLoadMore = false;
const Bookings = ({ navigation, route }) => {
  const { key, parentKey } = route.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [filters, setFilters] = useState({
    booking_status: null,
    end_date: null,
    filter_by_dates: false,
    sale_page: [],
    search_text: "",
    sort_by: "",
    start_date: null,
  })

  useEffect(() => {
    callAPi()
  }, [])

  const onAddScreen = () => {
    navigation.navigate(routes.bookingAdd)
  }

  const onFilterScreen = () => {
    navigation.navigate(routes.bookingFilter, {
      filters
    })
  }

  const callAPi = () => {
    console.log("callAPi")
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
    let res = await GET_BOOKINGS_LIST({
      navigation, token, page, filters
    })
    if (res.code == 200) {
      let length = newArray ? res?.bookings.length : list.length + res?.bookings.length;
      if (length < res?.bookings) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.bookings : [...list, ...res?.bookings]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
      setRefreshing(false);
    }
  }

  const statusView = (info) => {
    return (
      <View style={[__styles.statusView, { backgroundColor: info?.background_color }]}>
        <MyText color={info?.text_color} fontSize={14} >{info?.title}</MyText>
      </View>
    )
  }

  const renderBookings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.headerView}>
          <MemberView member={item?.user_info} marginLeft={0} size={35} titleSize={14} />
          <MenuButton />
        </View>
        <View>
          <StatView title={"Booking Page"} value={!!item?.page?.sale_page_title ? item?.page?.sale_page_title : "N/A"} />
          <StatView title={"Date"} value={`${moment(item?.date).format(dateTimeFormat.date)} (${moment(item?.time, "hh:mm A").format(dateTimeFormat.time)} - ${moment(item?.time, "hh:mm A").add({ minutes: Number(item?.slot_duration) }).format(dateTimeFormat.time)})`} uppercase />
          <StatView title={"Booking Status"} view={() => statusView(item?.booking_status_info)} />
        </View>
      </View>
    )
  }

  const topView = () => {
    return (
      <View style={__styles.topView}>
        <TitleView
          title={title}
          hideBackBottomButton
          subTitle={`Showing ${list.length} of ${total}`}
        />
        <View style={__styles.topBtnsView}>

          <TouchableOpacity onPress={onFilterScreen}>
            {icons.filterCircle(colors.primary,25)}
          </TouchableOpacity>
        </View >
      </View >
    )
  }


  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item?._id}
          data={list}
          renderItem={renderBookings}
          onEndReached={loadMore}
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Payment Requests Found'} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <FAB onPress={onAddScreen} />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Bookings

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
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
    minWidth: 80,
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