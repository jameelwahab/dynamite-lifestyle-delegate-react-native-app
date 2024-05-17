import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { FlatList } from 'react-native'
import EmptyView from '../../../components/EmptyView'
import MyLoader, { SimpleLoader } from '../../../components/MyLoader'
import Tabs from '../../../components/Tabs'
import { GET_ACCOUNTABILITY_TRACKER_BY_DELEGATE, GET_BOOKING_DETAIL_BY_DELEGATE, GET_DELEGATE_REPORT_LIST, GET_MONTHY_REPORT_BY_DELEGATE, GET_SALES_PERDORMANCE, GET_SALES_PERDORMANCE_BY_DELEGATE, GET_STREAK_PERFORMANCE_DETAIL_BY_DELEGATE } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import { icons } from '../../../utilities/icons'
import StatView from '../../Members/Components/StatView'
import prependCurency from '../../../functions/prependCurency'
import Collapsible from 'react-native-collapsible'
import FooterLoader from '../../../components/FooterLoader'
import MyRefreshControl from '../../../components/MyRefreshControl'
import TitleView from '../../../components/TitleView'
import routes from '../../../navigation/routes'
import SearchView from '../../../components/SearchView'
import MyChip from '../../../components/MyChip'
import { dateTimeFormat } from '../../../utilities/constants'
import moment from 'moment'
import Booking from './Booking'
import StreakPerformance from './StreakPerformance'
import MonthlyReport from '../DelegateMonthlyReport/MonthlyReport'
import AccountablityTracker from './AccountablityTracker'
import StreakPerformanceModal from '../components/StreakPerformanceModal'


let page = 0;
let canLoadMore = false;

const MainScreen = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const ref_streakPerformanceModal = useRef();
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [itemLoader, setItemLoader] = useState(false);
  const [itemDetail, setItemDetail] = useState(null)
  const [filter, setfilter] = useState({ start_date: undefined, end_date: undefined, monthYear: moment().format("MM-YYYY") })
  const [searchText, setSearchText] = useState("")
  const [searchLoader, setSearchLoader] = useState(false);



  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setTotal(0)
    setList([])
    setSelectedIndex(0)
    setLoader(true);
    if (selectedTab == 1) {
      getPerformance(true)
    } else {
      getDelegateReport(true)
    }
  }, [selectedTab, JSON.stringify(filter)])


  useEffect(() => {
    console.log(route.params?.filters)
    if (!!route.params?.filters) {
      setfilter(route.params?.filters)
    }
  }, [route])

  //*  Navigation 

  const onFilterScreen = () => {
    navigation.navigate(routes.delegateReportFilterScreen, {
      filter,
      selectedTab
    })
  }


  const onItemPress = (item, index) => {
    if (selectedTab == 3) {
      navigation.navigate(routes.delegeteMonthlyReportScreen, {
        item: item
      })
    } else if (index == selectedIndex) {
      setSelectedIndex(-1)
      setItemDetail(null)
    } else {
      setSelectedIndex(index)
      getDetail(list[index]?._id)
    }
  }


  //todo /////// API related

  const onSearch = () => {
    page = 0;
    canLoadMore = false;
    setSearchLoader(true);
    if (selectedTab == 1) {
      getPerformance(true)
    } else {
      getDelegateReport(true)
    }
  }

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true);
    if (selectedTab == 1) {
      getPerformance(true)
    } else {
      getDelegateReport(true)
    }
  }

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      if (selectedTab == 1) {
        getPerformance()
      } else {
        getDelegateReport()
      }
    }
  }

  const getDetail = (id) => {
    setItemLoader(true)
    if (selectedTab == 0) {
      getSteakPerformace(id)
    } else if (selectedTab == 2) {
      getBookingDetail(id)
    } else if (selectedTab == 4) {
      getAccountabilityDetail(id)
    }
  }

  //! ////// APIs

  const getDelegateReport = async (newArray = false) => {
    let res = await GET_DELEGATE_REPORT_LIST({
      navigation, token, page, body: {
        created_for: undefined,
        search_text: searchText.trim(),
        type: tabs[selectedTab].type,
        start_date: undefined,
        end_date: undefined,
      },
    });



    if (res.code == 200) {
      let length = newArray ? res?.delegate.length : list.length + res?.delegate.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      if (newArray && selectedTab != 1 && selectedTab != 3) {
        getDetail(res?.delegate[0]?._id)
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.delegate : [...list, ...res?.delegate]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    }
  }

  const getPerformance = async (newArray = false) => {
    let res = await GET_SALES_PERDORMANCE_BY_DELEGATE({
      navigation, token, page, body: {
        created_for: undefined,
        search_text: searchText.trim(),
        type: tabs[selectedTab].type,
        start_date: undefined,
        end_date: undefined,
      },
    });
    if (res.code == 200) {
      let length = newArray ? res?.consultant_list.length : list.length + res?.consultant_list.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.consultant_list : [...list, ...res?.consultant_list]);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
      setSearchLoader(false);
    }
  }

  const getSteakPerformace = async (delegateId) => {
    let res = await GET_STREAK_PERFORMANCE_DETAIL_BY_DELEGATE({
      navigation, token, page, body: {
        delegate_id: delegateId,
        type: "performance_info",
        start_date: !!filter?.start_date ? moment(filter?.start_date).format("DD-MM-YYYY") : undefined,
        end_date: !!filter?.end_date ? moment(filter?.end_date).format("DD-MM-YYYY") : undefined,
      },
    });
    if (res.code == 200) {
      setItemDetail(res)
      setItemLoader(false)
    } else {
      setItemLoader(false)
    }
  }

  const getBookingDetail = async (delegateId) => {
    let res = await GET_BOOKING_DETAIL_BY_DELEGATE({
      navigation, token, page, body: {
        delegate_id: delegateId,
        type: "performance_info",
        start_date: !!filter?.start_date ? moment(filter?.start_date).format("DD-MM-YYYY") : "",
        end_date: !!filter?.end_date ? moment(filter?.end_date).format("DD-MM-YYYY") : "",
      },
    });
    if (res.code == 200) {
      setItemDetail(res)
      setItemLoader(false)
    } else {
      setItemLoader(false)
    }
  }



  const getAccountabilityDetail = async (delegateId) => {
    let res = await GET_ACCOUNTABILITY_TRACKER_BY_DELEGATE({
      navigation, token, page, body: {
        delegate_id: delegateId,
        type: "performance_info",
        start_date: !!filter?.start_date ? moment(filter?.start_date).format("DD-MM-YYYY") : undefined,
        end_date: !!filter?.end_date ? moment(filter?.end_date).format("DD-MM-YYYY") : undefined,
      },
    });
    if (res.code == 200) {
      setItemDetail(res)
      setItemLoader(false)
    } else {
      setItemLoader(false)
    }
  }






  //* Views

  const getView = () => {
    if (selectedTab == 0) {
      return <StreakPerformance data={itemDetail} modalRef={ref_streakPerformanceModal} />
    } else if (selectedTab == 2) {
      return <Booking data={itemDetail} />
    } else if (selectedTab == 3) {
      return null
    } else if (selectedTab == 4) {
      return <AccountablityTracker data={itemDetail} />
    }
  }

  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        {searchView()}
        <View>
          <Tabs
            list={tabs}
            changeTab={(index) => setSelectedTab(index)}
            tab={selectedTab}
          />
        </View>
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <Pressable
          onPress={() => onItemPress(item, index)}
          style={__styles.header}>
          <View style={{ flex: 1 }}>
            <MemberView member={item} customImage={item?.image?.thumbnail_1} />
          </View>
          {selectedTab == 0 &&
            <View style={__styles.countView}>
              <MyText fontSize={12} color={colors.primary} >{item?.dynamite_streak_performance_count}</MyText>
            </View>}

          {selectedTab == 2 &&
            <View style={{ marginTop: 5, height: 25, justifyContent: "center", }}>
              <MyText fontSize={10} color={colors.primary} >{`Total Bookings: `}
                <MyText fontSize={12} color={colors.width} type='medium' >{`${item?.total_bookings}`}</MyText>
              </MyText>

            </View>
          }
          {selectedTab == 3 ?
            <View style={[__styles.arrowView, { transform: [{ rotateZ: "90deg" }] }]}>
              {icons.upwardArrow()}
            </View> :
            <View style={[__styles.arrowView,]}>
              {selectedIndex == index ? icons.upwardArrow() : icons.downwardArrow()}
            </View>
          }


        </Pressable>
        <Collapsible collapsed={selectedIndex != index} >
          {itemLoader ?
            <View style={{ height: 200, justifyContent: "center", alignItems: "center" }} >
              <SimpleLoader />
            </View> : null}
          {!itemLoader && !!itemDetail ?
            getView() :
            !itemLoader ? <EmptyView /> : null
          }
        </Collapsible>
      </View>
    )
  }

  const renderSaleItem = ({ item, index }) => {
    return (
      <View style={[__styles.itemView, { backgroundColor: colors.secondary, paddingHorizontal: 5, paddingBottom: 5 }]}>
        <View
          onPress={() => onItemPress(item, index)}
          style={__styles.header}>
          <View style={{ flex: 1 }}>
            <MemberView member={item} customImage={item?.image?.thumbnail_1} />
          </View>
        </View>
        <StatView title={"Total Commission"} value={`${prependCurency("gbp")}${item?.total_commission}`} />
        <StatView title={"Paid Commission"} value={`${prependCurency("gbp")}`} />
        <StatView title={"Due Commission"} value={`${prependCurency("gbp")}`} />
      </View>
    )
  }

  const render = (data) => {
    return (
      <>
        {selectedTab == 1 ? renderSaleItem(data) : renderItem(data)}
      </>
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
          <View style={__styles.topBtnsView}>
            {selectedTab != 3 &&
              <TouchableOpacity onPress={onFilterScreen}>
                {icons.filterCircle(colors.primary, 25)}
              </TouchableOpacity>}
          </View>
        </View>

      </View>
    )
  }

  const searchView = () => {
    return (
      <View style={{ marginHorizontal: 4 }}>
        <SearchView
          onChangeText={(text) => setSearchText(text)}
          search={searchText}
          onSearchPress={onSearch}
          loader={searchLoader}
        />
      </View>
    )
  }



  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={render}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          ListHeaderComponent={headerView()}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        />
      </View>


      <MyLoader style={{ top: 100 }} enable={loader} />

      <StreakPerformanceModal ref={ref_streakPerformanceModal} />
    </RootView>
  )
}

export default MainScreen;


const tabs = [
  {
    id: "streak_performance",
    index: 0,
    title: "STREAK PERFORMANCE",
    type: undefined,

  },
  {
    id: "sale_performance",
    index: 1,
    title: "SALES PERFORMANCE",
    type: ""
  },
  {
    id: "booking",
    index: 2,
    title: "BOOKINGS",
    type: "bookings"
  },
  {
    id: "monthly_report",
    index: 3,
    title: "MONTHLY REPORT",
    type: "list"
  },
  {
    id: "accountability_tracker",
    index: 4,
    title: "ACCOUNTABILITY TRACKER",
    type: "list"
  },
]


const __styles = StyleSheet.create({
  itemView: {
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: colors.secondary,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  countView: {
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    marginTop: 5,
    marginRight: 5
  },
  arrowView: {
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    marginTop: 5
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
