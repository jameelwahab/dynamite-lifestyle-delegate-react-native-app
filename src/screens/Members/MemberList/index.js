import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import invokeApi from '../../../functions/invokeAPI'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { IS_CHAT_EXIST, LIST_OF_MEMBERS, LIST_OF_MEMBERS_ONLY, LIST_OF_NURTURE } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import numFormatter from '../../../DAL/numFormatter'
import UserImage from '../../../components/UserImage'
import { icons } from '../../../utilities/icons'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import StatView from '../Components/StatView'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { dateTimeFormat } from '../../../utilities/constants'
import MyInputs from '../../../components/MyInputs'
import SortModal from '../Components/SortModal'
import debounce from '../../../functions/debounce'
import EmptyView from '../../../components/EmptyView'
import Collapsible from 'react-native-collapsible'
import FooterLoader from '../../../components/FooterLoader'
import FilterModal from '../Components/FilterModal'
import moment from 'moment'
import { filterFromlist, levelList, memberStatusList, onlineStatusList, membershipStatusList, expireDaysList } from '../Components/list'
import utilities from '../../../utilities'
import { MenuButton, TransparentButton } from '../../../components/MyButton'
import SaveFilterModal from '../Components/SaveFilterModal'
import OptionModal from '../../../components/OptionModal'



let canLoadMore = false;
let page = 0;
const MemberList = ({ navigation, route }) => {
  const { type } = route?.params;
  console.log(type, "type")
  const isAllMembers = type == "all-member";
  const isMembers = type == "member";
  const isNurture = type == "nurture";
  const { token, user } = useSelector(selectUser);
  const [showChips, setShowChips] = useState(false);
  const sortModalRef = useRef();
  const filterModalRef = useRef();
  const saveModalRef = useRef();
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false)
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("")
  const timezone = useSelector(selectTimeZone);
  const [sorted, setSorted] = useState(sort);
  const [Filter, setFilter] = useState({ ...filteroObj });
  const [filterData, setFilterData] = useState(null);
  const [isSavedFilterApplied, setIsSavedFilterApplied] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })

  const updateFilter = (updation) => {
    setFilter((filter) => ({ ...filter, ...updation }))
    setIsSavedFilterApplied(false)
  }

  const onOptSelected = (opt) => {
    console.log(opt, "onOptSelected");
    let { selectedItem: item } = optionModal;
    setOptionModal({ isVisible: false, selectedItem: null });
    if (opt?.key == "notes") {
      navigation.navigate(routes.memberNotesListing, {
        for: "members",
        memberId: item?._id
      })
    } else if (opt?.key == "subscription") {
      navigation.navigate(routes.memberSubscribersListing, {
        memberId: item?._id
      })
    }
  }

  const filterTheData = (obj, data, isSavedFilter, isFilter) => {
    setIsFilterApplied(isFilter)
    setIsSavedFilterApplied(isSavedFilter)
    setFilter({ ...obj })
    setFilterData(data)
  }


  const getMembers = async (isFirstTime) => {
    if (isFirstTime) {
      setLoader(true);
      setList([])
    }
    let res;

    if (isAllMembers) {
      res = await LIST_OF_MEMBERS({
        token, navigation, page: page, searchText: search, body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search
        }
      });
    } else if (isMembers) {
      res = await LIST_OF_MEMBERS_ONLY({
        token, navigation, page: page, searchText: search, body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search
        }
      });
    } else if (isNurture) {
      res = await LIST_OF_NURTURE({
        token, navigation, page: page, searchText: search, body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search
        }
      });
    }
    if (res.code == 200) {
      let length = isFirstTime ? 0 : list.length;




      if (isAllMembers) {
        if (res?.total_member_count > (res?.member.length + length)) {
          page = page + 1;
          canLoadMore = true
        } else {
          canLoadMore = false
        }
        setList(isFirstTime ? res?.member : [...list, ...res?.member])
        setTotal(res?.total_member_count);
      } else if (isMembers) {
        if (res?.total_count > (res?.event_subscriber.length + length)) {
          page = page + 1;
          canLoadMore = true
        } else {
          canLoadMore = false
        }
        setList(isFirstTime ? res?.event_subscriber : [...list, ...res?.event_subscriber])
        setTotal(res?.total_count);
      } else if (isNurture) {
        if (res?.total_count > (res?.member_array.length + length)) {
          page = page + 1;
          canLoadMore = true
        } else {
          canLoadMore = false
        }
        setList(isFirstTime ? res?.member_array : [...list, ...res?.member_array])
        setTotal(res?.total_count);
      }

      setLoader(false);
      setFooterLoader(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
    }
  }

  const saveFilter = () => {
    saveModalRef?.current?.openModal()
  }

  const clearFilter = () => {
    setFilter({ ...filteroObj });
    setSorted(null);
    setIsFilterApplied(false)
    setIsSavedFilterApplied(false)

  }

  useEffect(() => {
    page = 0;
    canLoadMore = false
    debounce(() => getMembers(true), 100)
  }, [search, JSON.stringify(sorted), JSON.stringify(Filter)])


  const onMemberDetail = (item) => {
    navigation.navigate(routes.memberDetails, {
      member: item,

    })
  }



  const topView = () => {
    return (
      <View style={{ flexDirection: "row", flex: 1, marginHorizontal: 15, alignItems: "center", }}>
        <View>
          <MyText fontSize={18} type='bold' color={colors.primary} >{
            isAllMembers ? "All Members" :
              isMembers ? "Members" :
                isNurture ? "Nurture" : ""
          }</MyText>
          <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Showing ${list.length} of ${total}`}</MyText>
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={() => sortModalRef?.current?.openModal()}
            style={__styles.headerBtn} >
            {icons.sort(colors.black, 17)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterModalRef?.current?.openModal()}
            style={__styles.headerBtn}>
            {icons.filter(colors.black, 17)}
          </TouchableOpacity>
        </View>
      </View >
    )
  }

  const chip = (title, onPress) => {
    return (
      <View style={__styles.chipView}>
        <View style={{}}>
          <MyText fontSize={12} color={colors.white} >{title}</MyText>
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={__styles.chipBtn}>
          {icons.crosss(colors.primary, 15)}
        </TouchableOpacity>
      </View>
    )
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

  const getNameForDelage = (list, id) => {
    let obj = list.find((x) => x._id == id);
    return obj.first_name + " " + obj.last_name
  }

  const countLength = () => {
    let count = 0;
    console.log("<========== Filter Start =================>")
    Object.keys(Filter).forEach(filter => {
      if (Array.isArray(Filter[filter])) {
        count = count + Filter[filter].length;
      } else if (typeof (Filter[filter]) == "string") {
        if (filter != "from_date" && filter != "to_date" && filter != "membership_purchase_expiry_from" && filter != "membership_purchase_expiry_to" && filter != "date" && filter != "status" && !!Filter[filter] && filter != "coins_from" && filter != "coins_to") {
          count = count + 1;
        }
      } else if (typeof (Filter[filter]) == "boolean") {
        if (Filter[filter]) {
          
          count = count + 1;
        }
        
      }
      
    })
    if (!!sorted) {
      count = count + 1;
    }
    console.log(count, "count")
    console.log("<========== Filter End =================>")
    return count;
  }


  const headerView = () => {
    return (
      <View style={{ paddingHorizontal: 5, backgroundColor: colors.darkSecondary }}>
        {(isFilterApplied || sorted != null) &&
          <>

            <View style={[__styles.allChipView, countLength() > 5 ?
              { height: showChips ? undefined : 55, overflow: "hidden" }:{
                height:undefined,overflow:"visible"
              }]}>
              <View style={{}}>
                <MyText type='bold' >{"Filtered By : "}</MyText>
              </View>
              {Filter?.community?.map((x) => chip(levelList.find(y => y.key == x).title, () => updateFilter({ community: Filter?.community.slice().filter(z => z != x) })))}
              {!!Filter?.event_page[0] && chip(filterData?.sale_pages.find((x) => x._id == Filter?.event_page[0])?.sale_page_title, () => updateFilter({ event_page: [] }))}
              {!!sorted && chip(sorted.title, () => setSorted(null))}
              {!!Filter?.event_page[0] && !!Filter?.plan && chip(filterData?.sale_pages.find((x) => x._id == Filter?.event_page[0])?.payment_plans.find(z => z?._id == Filter.plan)?.plan_title, () => updateFilter({ plan: null }))}
              {!!Filter?.nurture && chip(getNameForDelage(filterData?.delegates_list, Filter?.nurture), () => updateFilter({ nurture: null }))}
              {!!Filter?.delegate && chip(getNameForDelage(filterData?.delegates, Filter?.delegate), () => updateFilter({ delegate: null }))}
              {Filter?.lead_status?.map((x) => chip(filterData?.lead_status.find(y => y._id == x)?.title, () => updateFilter({ lead_status: Filter?.lead_status.filter(y => y != x) })))}
              {typeof (Filter?.status) == "boolean" && chip(Filter?.status ? "Active" : "Inactive", () => updateFilter({ status: "" }))}
              {Filter?.user_status_type != "" && chip(onlineStatusList.find(x => x.key == Filter?.user_status_type)?.title, () => updateFilter({ user_status_type: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry != 'not_expired' && chip(membershipStatusList.find(x => x.key == Filter?.member_ship_expiry)?.title, () => updateFilter({ member_ship_expiry: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry == 'not_expired' && Filter?.expiry_in != 'custom' && chip(`Expiry in ${expireDaysList.find(x => x.key == Filter?.expiry_in)?.title}`, () => updateFilter({ expiry_in: 3, member_ship_expiry: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry == 'not_expired' && Filter?.expiry_in == "custom" && chip(`Membership Expiry Start Date : ${moment(filterData?.membership_purchase_expiry_from).format("YYYY-MM-DD")} - Membership Expiry End Date : ${moment(filterData?.membership_purchase_expiry_to).format("YYYY-MM-DD")}`, () => updateFilter({ expiry_in: 3, member_ship_expiry: "" }))}
              {!!Filter?.is_date_range && !!Filter?.from_date != "" && !!Filter?.to_date != "" && chip(`Start Date : ${moment(filterData?.from_date).format("YYYY-MM-DD")} - End Date : ${moment(filterData?.to_date).format("YYYY-MM-DD")}`, () => updateFilter({ is_date_range: false, from_date: null, to_date: null }))}
              {!!Filter?.coins_range && chip(`Start Coins : ${Filter?.coins_from} - End Coins : ${Filter?.coins_to}`, () => updateFilter({ coins_range: false, coins_from: 0, coins_to: 0 }))}
            </View>

            {isFilterApplied &&
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>

                {!isSavedFilterApplied &&
                  <TransparentButton title='Save Filter' onPress={saveFilter} />}
                <TransparentButton title='Clear All' onPress={clearFilter} />

                {countLength() > 5 && <TransparentButton title={showChips ?
                  "Show Less" : "Show All"} onPress={() => setShowChips(!showChips)} />}
              </View>
            }
          </>}
        {/* <Collapsible collapsed={searchCollapsed}> */}
        <View style={{ marginTop: -5 }}>
          <MyInputs
            rightIcon={!!search ? icons.crosssWithCircle_20 : icons.noIcon}
            leftIcon={icons.search}
            value={search}
            placeholder='Search...'
            onChangeText={(text) => setSearch(text)}
            rightIconOnPress={() => setSearch("")}
            noSpace
          />
        </View>
        {/* </Collapsible> */}
      </View>)
  }


  const renderMemberList = ({ item, index }) => {
    return (
      <View style={__styles.memberRootView}>

        <View style={__styles.memberProfileView}>
          <View>
            <UserImage
              image={item?.profile_image}
              name={item?.first_name}
              size={30} />
            <View style={[{ backgroundColor: item?.is_online ? colors.online : colors.primary2, }, __styles.memberStatusView]} />
          </View>

          <View style={__styles.memberProfileNameView}>
            <MyText fontSize={14} type='bold'>{item?.first_name + " " + item?.last_name}</MyText>
            {isAllMembers && <MyText fontSize={12} >{item?.email}</MyText>}
          </View>

          {item?.is_wheel_of_life &&
            <View style={{ marginRight: 10 }}>
              <Image source={icons.wheelOfLife} style={{ height: 20, width: 20 }} />
            </View>}

          <TouchableOpacity
            style={{ marginRight: 5 }}
            onPress={() => onChatScreen(item?._id)}>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>

          <MenuButton
            size={20}
            onPress={() => {
              setOptionModal({
                isVisible: true,
                selectedItem: item
              })
            }}
          />

        </View>

        <View>
          <StatView title={"Coins"} value={numFormatter(item?.coins_count)} uppercase />
          {isAllMembers && <StatView title={"Reffered User"} value={!!item?.affliliate ?
            item?.affliliate?.affiliate_user_info?.first_name + " " + item?.affliliate?.affiliate_user_info?.last_name + " (" + item?.affliliate?.affiliate_url_name + ") " : "Master Link"} />}
          {!isNurture && <StatView title={"Nurture"} value={!!item?.nurture ? item?.nurture?.first_name + " " + item?.nurture?.last_name : "N/A"} />}
          {!isMembers && <StatView title={"Delegate"} value={!!item?.consultant ? item?.consultant?.first_name + " " + item?.consultant?.last_name : "N/A"} />}
          <StatView title={"Community Level"} value={item?.community_level} uppercase={item?.community_level == 'pta'} />
          <StatView title={"Membership Expire"} value={!!item?.membership_purchase_expiry ?
            !isAllMembers ? moment(new Date(item?.membership_purchase_expiry)).format(dateTimeFormat.date) :
              item?.membership_purchase_expiry
            : "N/A"} />
          {/* <StatView title={"Regis Expire"} value={convertTimezone(item?.createdAt, timezone).format(dateTimeFormat.date)} /> */}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => onMemberDetail(item)}
            style={{ padding: 5, marginTop: 10 }}>
            <MyText color={colors.primary} type='medium' >View More...</MyText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }






  return (
    <RootView hideBackBottomButton titleView={topView}>
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          data={list}
          renderItem={renderMemberList}
          ListEmptyComponent={!loader && <EmptyView />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          onEndReached={() => {
            if (canLoadMore) {
              canLoadMore = false;
              setFooterLoader(true)
              getMembers(false)
            }
          }}
        />
      </View>
      <MyLoader enable={loader} />

      <SortModal
        ref={sortModalRef}
        onSelected={(selected) => {
          setSorted(selected)
        }}
        alreadySelected={sorted}
      />
      <FilterModal
        token={token}
        filterTheData={filterTheData}
        ref={filterModalRef}
        appliedFilter={{ ...Filter, isSavedFilterApplied: isSavedFilterApplied }}
        isMembers={isMembers}
        isNurture={isNurture}
        isAllMembers={isAllMembers}
      />

      <SaveFilterModal
        token={token}
        navigation={navigation}
        ref={saveModalRef}
        tabName={type}
        filters={Filter}
        filterData={filterData}
        searchText={search}
        sort={sorted}
        isMembers={isMembers}
        isNurture={isNurture}
        isAllMembers={isAllMembers}
      />

      <OptionModal
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}
        isVisible={optionModal?.isVisible}
        onSelected={onOptSelected}
        optionList={optionList}
      />
    </RootView>
  )
}

export default MemberList

const optionList = [
  {
    key: "subscription",
    title: "View Subscription",
    icon: () => icons.eye(colors.primary, 20)
  },
  {
    key: "notes",
    title: "Personal Notes",
    icon: () => icons.notes(colors.primary, 20)
  },
  // {
  //   key: "profile",
  //   title: "View Profile",
  //   icon: () => icons.eye(colors.primary, 20)
  // },
  // {
  //   key: "question-answer",
  //   title: "Questions Answers",
  //   icon: () => icons.lock(colors.primary, 20)
  // },

]

const sort = {
  key: "registration_date_desc",
  title: "Registration Date (Newest First)"
}

const filteroObj = {
  "community": [],
  "event_page": [],
  "lead_status": [],
  "plan": null,
  "nurture": null,
  "delegate": null,
  "is_date_range": false,
  "coins_range": false,
  "coins_from": 0,
  "coins_to": 0,
  "from_date": null,
  "to_date": null,
  "membership_purchase_expiry_from": moment(),
  "membership_purchase_expiry_to": moment(),
  "date": null,
  "coins": null,
  "membership_expiry": null,
  "status": "",
  "expiry_in": 3,
  "member_ship_expiry": "",
  "user_status_type": "",
}


const __styles = StyleSheet.create({
  memberRootView: { backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10, padding: 10 },
  memberProfileView: { flexDirection: "row", alignItems: "center" },
  memberStatusView: { position: "absolute", bottom: 0, right: 0, height: 10, width: 10, borderRadius: 10 / 2, },
  memberProfileNameView: { flex: 1, marginLeft: 10 },
  headerBtn: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    backgroundColor: colors.primary,
  },
  allChipView: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",

  },
  chipView: {
    paddingVertical: 2,
    paddingRight: 5,
    paddingLeft: 10,
    backgroundColor: colors.chip,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    margin: 2,
    maxWidth: utilities.screenWidth() - 40
  },
  chipBtn: {
    marginLeft: 5,
    height: 20,
    width: 20,
    backgroundColor: colors.black,
    alignItems: "center", justifyContent: "center",
    borderRadius: 20 / 2
  }
})