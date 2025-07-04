import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { BOOKING_DELETE, GET_BOOKINGS_LIST, GET_PODS_LIST, POD_DELETE } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import { MenuButton } from '../../../components/MyButton'
import StatView from '../../Members/Components/StatView'
import moment from 'moment'
import {  dateTimeFormat } from '../../../utilities/constants'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import MyChip from '../../../components/MyChip'
import SearchView from '../../../components/SearchView'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import utilities from '../../../utilities'
import MyWebview from '../../../components/MyWebview'
import showToast from '../../../functions/showToast'





let page = 0;
let canLoadMore = false;
const Listing = ({ navigation, route }) => {
  const ref_changeStatusModal = useRef();
  const { value, parentValue, type } = route.params;
  const isBookCall = type == "booking";
  const { navbar } = useSelector(selectNavbar);
  const { token,S3_URL } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null, list: [] });
  const [confirmModal, setConfirmModal] = useState({ isVisible: false, item: null });
  const [filters, setFilters] = useState({
    communityLevel: { ...defaultfilter },
    podType: { ...defaultfilter },
  });



  useEffect(() => {
    callAPi()
  }, [JSON.stringify(filters), route])

  useEffect(() => {
    if (route?.params?.filters) {
      setFilters(route?.params?.filters);
    } else if (route?.params?.callList) {
      callAPi()
    }
  }, [route])

  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null, list: [] })
    if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmModal({ isVisible: true, item: item });
      }, 500);
    } else if (opt.key == "edit") {
      navigation.navigate(routes.podAddScreen, {
        editableItem: item,
        type: "edit",
        updateRoom: updateRoom
      })
    }
  }

  const updateRoom = (room) => {
    let index = list.findIndex(r => r._id == room._id);
    if (index > -1) {
      list.splice(index, 1, room);
      setList([...list]);
    }
  }
  const openOptions = (item) => {
    let opt = [...optionsList];
    let status = item?.booking_status_info?.title.toLowerCase();
    if (status != "complete" && status != "cancel") {
      let date = moment(item.date).format(dateTimeFormat.date);
      let bookingTime = moment(date + " " + item?.time, dateTimeFormat.dateTime);
      let diff = moment(bookingTime).diff(moment(), "hours");
      if (diff > 1) {
        opt = [...optionsList, ...extraOptions];
      }
    }
    setOptionModal({ isVisible: true, item: item, list: opt })
  }

  const onConfirmPress = (opt) => {
    let { item } = confirmModal;
    setConfirmModal({ isVisible: false, item: null })
    deletePodFromServer(item?.room_slug)
  }

  const onAddScreen = () => {
    navigation.navigate(routes.podAddScreen, { editableItem: undefined, type: "add" })
  }

  const onFilterScreen = () => {
    navigation.navigate(routes.podFilterScreen, {
      filters,
      screen: route.name,
      isBookCall
    })
  }

  const onPodDetailScreen = (slug) => {
    navigation.navigate(routes.podDetailScreen, {
      slug
    })
  }

  const onSearchPress = () => {
    canLoadMore = false;
    page = 0;
    setSearchLoader(true);
    getBookingsFromServer(true)
  }



  const clearFilter = () => {
    setSearchText('')
    setFilters({
      communityLevel: { ...defaultfilter },
      podType: { ...defaultfilter },
    })
  }

  const isFilterApplied = () => {
    return (filters?.communityLevel?.key != 'all' || filters?.podType.key != 'all')
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

    let res = await GET_PODS_LIST({
      navigation, token, page,
      community_level: filters.communityLevel?.key,
      pod_type: filters.podType?.key,
      search_text: searchText.trim(),
      room_type: type
    })
    if (res.code == 200) {
      let length = newArray ? res?.room.length : list.length + res?.room.length;
      if (length < res?.room_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.room_count)
      setList(newArray ? res?.room : [...list, ...res?.room]);
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

  const deletePodFromServer = async (slug) => {
    setLoader(true)
    let res = await POD_DELETE({ navigation, token, slug })
    if (res.code == 200) {
      showToast({ title: res?.message, type: 'success' });
      let nlist = list.slice().filter(x => x.room_slug != slug)
      setList([...nlist])
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  const renderBookings = useCallback(({ item, index }) => {
    return (
      <Pressable
        onPress={() => onPodDetailScreen(item?.room_slug)}
        style={__styles.itemView}>
        <View style={{}}>
          <ResponsiveImage2
            uri={S3_URL + item?.room_image?.thumbnail_1}
            width={utilities.screenWidth() - 20}
          />
          <View style={__styles.menuBtn}>
            <MenuButton
              onPress={() => openOptions(item, index)}
            />
          </View>

          <View style={{ padding: 10 }}>
            <MyText fontSize={18} type='bold' color={colors.primary} >{item?.title}</MyText>
            {!!item?.short_description &&
              <View >
                <MyWebview html={item?.short_description} />
              </View>}
          </View>
        </View>

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
          <View style={__styles.topBtnsView}>
            <TouchableOpacity onPress={onFilterScreen}>
              {icons.filterCircle(colors.primary, 25)}
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        {isFilterApplied() &&
          <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
            {filters?.communityLevel?.key != "all" &&
              <MyChip title={filters?.communityLevel?.title}
                onPress={() => setFilters({ ...filters, communityLevel: { ...defaultfilter } })} />}

            {filters?.podType?.key != "all" &&
              <MyChip title={filters?.podType?.title}
                onPress={() => setFilters({ ...filters, podType: { ...defaultfilter } })} />}


            {/* <View style={{ width: "100%", marginVertical: 5, alignItems: "flex-end" }}> */}
            <TouchableOpacity
              onPress={clearFilter}
              style={{ marginRight: 10, borderWidth: 1,  borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,borderColor: colors.primary, backgroundColor: colors.primary + "22", alignSelf: "flex-end", marginLeft: 5 }}>
              <MyText color={colors.primary}>{"Clear Filter"}</MyText>
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

  return (
    <View style={{ flex: 1 }}>
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
          ListEmptyComponent={!loader && !refreshing && <EmptyView label={`No Pods Found`} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>

      {!isBookCall && <FAB onPress={onAddScreen} />}
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionModal?.list}
        closeModal={() => setOptionModal({ isVisible: false, item: null, list: [] })}
      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, item: null })}
        onAgree={onConfirmPress}
        title={"Are you sure you want to delete this Pod?"}
      />

    </View>
  )
}

export default Listing
const optionsList = [
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]

const defaultfilter = {
  title: "All",
  key: "all"
}


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    // padding: 10,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  menuBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex:1
    // alignSelf:"flex-end"
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
  topBtnsView: {
    flexDirection: "row",
    alignItems: "flex-end",

  },

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