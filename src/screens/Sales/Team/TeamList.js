import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import { DELETE_SALE_TEAM_MEMBER, SALE_TEAM_LIST } from '../../../DAL'
import MemberView from '../../../components/MemberView'
import { colors } from '../../../utilities/colors'
import StatView from '../../../components/StatView'
import prependCurency from '../../../functions/prependCurency'
import { MenuButton } from '../../../components/MyButton'
import SearchView from '../../../components/SearchView'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import MyRefreshControl from '../../../components/MyRefreshControl'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import MyLoader from '../../../components/MyLoader'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import MyChip from '../../../components/MyChip'


let tlPage = 0;
let tlCanLoadMore = false;
const TeamList = ({ navigation, route }) => {
  const { value, parentValue } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x.value == parentValue)?.child_options?.find(y => y.value == value)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null, });
  const [confirmModal, setConfirmModal] = useState({ isVisible: false, item: null });
  const [filters, setFilters] = useState({
    commission_from: 0,
    commission_to: 0,
    end_date: null,
    start_date: null,
    search_by_commission: false,
    status: {
      key: "active",
      title: "Active",
      value: true,
    }
  })

  useEffect(() => {
    tlCanLoadMore = false;
    tlPage = 0;
    setLoader(true)
    getTeamListFromServer(true)
  }, [filters])


  useEffect(() => {
    if (!!route.params?.filters) {
      setFilters(route.params.filters)
    } else if (!!route.params?.member) {
      updateMemberInList(route.params.member)
    }
  }, [route])

  const updateMemberInList = (member) => {
    tlCanLoadMore = false;
    tlPage = 0;
    setLoader(true)
    getTeamListFromServer(true)
    // let index = list.findIndex(x => x?._id == member._id);
    // if (index > -1) {
    //   list.splice(index, 1, member);
    // } else {
    //   list.unshift(member);
    //   setTotal(val => ++val)
    // }
    // setList([...list]);
  }

  const onSearchPress = () => {
    tlCanLoadMore = false;
    tlPage = 0;
    setSearchLoader(true);
    getTeamListFromServer(true)
  }

  const onRefresh = () => {
    tlCanLoadMore = false;
    tlPage = 0;
    setRefreshing(true)
    getTeamListFromServer(true)
  }

  const loadMore = () => {
    if (tlCanLoadMore) {
      tlCanLoadMore = false;
      setFooterLoader(true);
      getTeamListFromServer()
    }
  }

  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null, })
    if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmModal({ isVisible: true, item: item });
      }, 500);
    } else if (opt.key == "edit") {
      setTimeout(() => {
        navigation.navigate(routes.salesTeamAddEdit, { member: item })
      }, 500);
    } else if (opt.key == "detail") {
      setTimeout(() => {
        navigation.navigate(routes.salesTeamDetail, { member: item })
      }, 500);
    }
  }



  //! //////// API
  const getTeamListFromServer = async (newArray = false) => {
    let res = await SALE_TEAM_LIST({
      token, navigation, page: tlPage, filter: {
        commission_from: Number(filters?.commission_from),
        commission_to: Number(filters?.commission_to),
        end_date: !!filters?.end_date ? moment(filters?.end_date).format("YYYY-MM-DD") : null,
        start_date: !!filters?.start_date ? moment(filters?.start_date).format("YYYY-MM-DD") : null,
        search_by_commission: filters?.search_by_commission,
        status: filters?.status?.value,
        search_text: searchText.trim()
      }
    });
    if (res.code == 200) {
      let length = newArray ? res?.sales_team.length : list.length + res?.sales_team.length;
      if (length < res?.total_count) {
        tlPage++;
        tlCanLoadMore = true;
      } else {
        tlCanLoadMore = false;
      }
      setTotal(res?.total_count)
      setLoader(false);
      setList(newArray ? res?.sales_team : [...list, ...res?.sales_team]);
      setSearchLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
    } else {
      setLoader(false);
      setSearchLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
    }
  }

  const deleteTeamMemberFromServer = async (id) => {
    setLoader(true)
    let res = await DELETE_SALE_TEAM_MEMBER({ token, navigation, id });
    if (res.code == 200) {
      setList((list) => list.slice().filter(x => x._id != id))
      setTotal((val) => --val);
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const onConfirmPress = (opt) => {
    let { item } = confirmModal;
    setConfirmModal({ isVisible: false, item: null })
    deleteTeamMemberFromServer(item?._id)
  }


  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >
          {value ? "Active" : "Inactive"}
        </MyText>
      </View>)
  }


  const memberListView = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <MemberView
              member={item}
              customImage={item?.image?.thumbnail_1}
            />
          </View>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, item: item })}
          />
        </View>
        <View style={{ padding: 5 }}>
          <StatView title={"Phone"} value={"+" + item?.contact_number} />
          <StatView title={"Total Commission"} value={prependCurency("gbp") + " " + (!!item?.total_commission ? item?.total_commission.toFixed(2) : "0.00")} />
          <StatView title={"Paid Commission"} value={prependCurency("gbp") + " " + (!!item?.commission_paid ? item?.commission_paid.toFixed(2) : "0.00")} />
          <StatView title={"Due Commission"} value={prependCurency("gbp") + " " + (!!item?.commission_due ? item?.commission_due.toFixed(2) : "0.00")} />
          <StatView title={"Status"} view={() => statusView(item?.status)} />
        </View>
      </View>
    )
  }

  const setToAll = () => {
    setFilters({ ...filters, status: { key: "all", title: "All", value: undefined, } })
  }

  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        {/* {isFilterApplied() && */}
        <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", paddingBottom: 5 }}>
          <MyText type='medium' >Filtered By : </MyText>
          <MyChip title={filters?.status?.title}
            onPress={filters?.status?.key != 'all' ? setToAll : undefined} />
          {!!filters?.start_date && !!filters.end_date &&
            <MyChip title={`Commission Date from ${moment(filters.start_date).format(dateTimeFormat.date)} to ${moment(filters.end_date).format(dateTimeFormat.date)}`}
              onPress={() => setFilters({ ...filters, start_date: null, end_date: null })} />}

          {!!filters?.search_by_commission &&
            <MyChip title={`Commission Date from ${filters?.commission_from} to ${filters?.commission_to}`}
              onPress={() => setFilters({ ...filters, search_by_commission: false, commission_from: 0, commission_to: 0 })} />}



          {(!!filters.start_date || filters.end_date || !!filters?.search_by_commission || filters?.status?.key != "all") &&
            <TouchableOpacity
              onPress={() => setFilters({ start_date: null, end_date: null, status: { key: "all", title: "All", value: undefined, }, search_by_commission: false, commission_from: 0, commission_to: 0 })}
              style={{ marginLeft: 5, marginTop: 5, marginRight: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primary + "33" }}>
              <MyText color={colors.primary}>{"Clear Filter"}</MyText>
            </TouchableOpacity>}


        </View>
        {/* } */}

        <SearchView
          onChangeText={(text) => setSearchText(text)}
          onSearchPress={onSearchPress}
          loader={searchLoader}
          search={searchText}
        />
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
          <View style={__styles.topBtnsView}>
            <TouchableOpacity onPress={() => navigation.navigate(routes.salesTeamFilterScreen, { filters })}>
              {icons.filterCircle(colors.primary, 25)}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }


  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          ListEmptyComponent={!loader && <EmptyView label={"No Team Member Found!"} />}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          data={list}
          renderItem={memberListView}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />
      </View>

      <MyLoader enable={loader} />
      <FAB onPress={() => navigation.navigate(routes.salesTeamAddEdit, { member: undefined })} />
      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptionModal({ isVisible: false, item: null, })}
      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, item: null })}
        onAgree={onConfirmPress}
        title={"Are you sure you want to delete this Team Member?"}
      />

    </RootView>
  )
}

export default TeamList

const optionsList = [
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Commission Detail",
    key: "detail",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },
]


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 5,
    marginTop: 10

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