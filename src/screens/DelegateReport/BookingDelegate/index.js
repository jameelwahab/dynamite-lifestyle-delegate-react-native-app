import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import { GET_REPORT_BOOKINS_LIST } from '../../../DAL'
import MemberView from '../../../components/MemberView'
import StatView from '../../../components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import MyLoader from '../../../components/MyLoader'
import TitleView from '../../../components/TitleView'
import EmptyView from '../../../components/EmptyView'
import FooterLoader from '../../../components/FooterLoader'
import MyRefreshControl from '../../../components/MyRefreshControl'
import SearchView from '../../../components/SearchView'
import MyChip from '../../../components/MyChip'


let dbpage = 0;
let dbCanLoadMore = false;
const BookingDelegate = ({ navigation, route }) => {
  const { item } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);
  const [filters, setFilters] = useState({
    booking_status: null,
    end_date: null,
    filter_by_dates: false,
    sale_page: [],
    search_text: "",
    sort_by: "",
    start_date: null,
  })


  // useEffect(() => {
  //   setLoader(true);
  //   getDelegateBooking(true)
  // }, [])
  useEffect(() => {
    callAPi()
  }, [JSON.stringify(filters)])

  useEffect(() => {
    if (route?.params?.filters) {
      setFilters(route?.params?.filters);
    } else if (route?.params?.callList) {
      callAPi()
    }
  }, [route])

  //? Other functions

  const callAPi = () => {
    dbCanLoadMore = false;
    dbpage = 0;
    setList([])
    setLoader(true);
    getDelegateBooking(true)
  }



  const onFilterScreen = () => {
    navigation.navigate(routes.delegateReportBookingsFilterScreen, {
      filters,
      item
    })
  }


  const loadMore = () => {
    if (dbCanLoadMore) {
      dbCanLoadMore = false;
      setFooterLoader(true);
      getDelegateBooking()
    }
  }

  const onRefresh = () => {
    dbpage = 0;
    dbCanLoadMore = false;
    setRefreshing(true)
    getDelegateBooking(true)
  }
  const onSearchPress = () => {
    dbpage = 0;
    dbCanLoadMore = false;
    setSearchLoader(true);
    getDelegateBooking(true)
  }


  const clearFilter = () => {
    setSearchText('')
    setFilters({
      booking_status: null,
      end_date: null,
      filter_by_dates: false,
      sale_page: [],
      search_text: "",
      sort_by: "",
      start_date: null,
    })
  }

  const isFilterApplied = () => {
    return (filters.sale_page.length > 0 || !!filters?.booking_status || !!filters?.booking_status
      || (filters?.filter_by_dates && (!!filters?.start_date || !!filters?.end_date)) || !!filters?.sort_by);
  }



  //!  APIs

  const getDelegateBooking = async (newArray = false) => {
    let filterObj = {
      booking_status: !!filters?.booking_status ? filters?.booking_status?._id : null,
      end_date: !!filters?.end_date ? moment(filters?.end_date).format("YYYY-MM-DD") : null,
      filter_by_dates: filters?.filter_by_dates,
      sale_page: filters?.sale_page.map(x => x?._id),
      search_text: searchText.trim(),
      sort_by: !!filters?.sort_by ? filters?.sort_by?.key : "",
      start_date: !!filters?.start_date ? moment(filters?.start_date).format("YYYY-MM-DD") : null,
    }


    let res = await GET_REPORT_BOOKINS_LIST({ navigation, token, deleagteId: item?._id, page: dbpage, body: filterObj });

    if (res.code == 200) {
      let length = newArray ? res?.bookings.length : list.length + res?.bookings.length;
      if (length < res?.total_count) {
        dbpage++;
        dbCanLoadMore = true;
      } else {
        dbCanLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.bookings : [...list, ...res?.bookings]);
      setLoader(false);
      setFooterLoader(false)
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false)
      setRefreshing(false);
      setSearchLoader(false);
    }
  }



  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TitleView
            title={`${item?.first_name} ${item?.last_name} Bookings`}
            hideBackBottomButton
            subTitle={`Showing ${list.length} of ${total}`}
          />
        </View>
        <TouchableOpacity
          onPress={onFilterScreen}
          style={{ paddingRight: 5 }}>
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View >
    )
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        {isFilterApplied() &&
          <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
            {!!filters?.booking_status &&
              <MyChip title={filters?.booking_status?.title}
                onPress={() => setFilters({ ...filters, booking_status: null })} />}

            {!!filters?.sale_page && filters?.sale_page.map((x, i) =>
              <MyChip title={x?.sale_page_title}
                onPress={() => clearSalePage(i)} />)}

            {!!filters?.sort_by &&
              <MyChip title={filters?.sort_by?.sort_title}
                onPress={() => setFilters({ ...filters, sort_by: null })} />}


            {(!!filters?.filter_by_dates && (!!filters?.start_date || !!filters?.end_date)) &&
              <MyChip title={`${!!filters?.start_date ? "Start Date: " + moment(filters?.start_date).format(dateTimeFormat?.date) : ""}${!!filters?.end_date ? " End Date: " + moment(filters?.end_date).format(dateTimeFormat?.date) : ""}`}
                onPress={() => setFilters({ ...filters, filter_by_dates: false, start_date: null, end_date: null })} />}

            {/* <View style={{ width: "100%", marginVertical: 5, alignItems: "flex-end" }}> */}
            <TouchableOpacity
              onPress={clearFilter}
              style={{ marginLeft: 5, marginTop: 2, marginRight: 10, borderWidth: 1, borderColor: colors.delete, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.heart + "33" }}>
              <MyText color={colors.delete}>{"Clear Filter"}</MyText>
            </TouchableOpacity>
            {/* </View> */}

          </View>}

        <SearchView
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearchPress}
          loader={searchLoader}
          search={searchText}
        />
      </View>
    )
  }

  const statusView = (info) => {
    return (
      <View style={[__styles.statusView, { backgroundColor: info?.background_color }]}>
        <MyText color={info?.text_color} fontSize={14} type='medium' >{info?.title}</MyText>
      </View>
    )
  }

  const renderBookings = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={__styles.headerView}>
          <MemberView member={item?.user_info} marginLeft={0} size={35} titleSize={14} />
        </View>
        <View>
          <StatView title={"Booking Page"} value={!!item?.page?.sale_page_title ? item?.page?.sale_page_title : "N/A"} />
          <StatView title={"Date"} value={`${moment(item?.date).format(dateTimeFormat.date)} (${moment(item?.time, "hh:mm A").format(dateTimeFormat.time)} - ${moment(item?.time, "hh:mm A").add({ minutes: Number(item?.slot_duration) }).format(dateTimeFormat.time)})`} uppercase />
          <StatView title={"Booking Status"} view={() => statusView(item?.booking_status_info)} />
        </View>
      </View>
    )
  }


  return (
    <RootView titleView={topView} >
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
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={'No Bookings Found'} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView >
  )
}

export default BookingDelegate


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
    backgroundColor: colors
      .primary,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5
  }
})