import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import { DELETE_SALE_TEAM_MEMBER, SALE_TRANSACTION_LIST } from '../../../DAL'
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
import { convertTimezone, convertTimezone2 } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'


let trlPage = 0;
let trlCanLoadMore = false;
const TeamList = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
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
    status: true
  })

  useEffect(() => {
    trlCanLoadMore = false;
    trlPage = 0;
    setLoader(true)
    getTeamListFromServer(true)
  }, [])


  useEffect(() => {
    if (!!route?.params?.refresh) {
      trlCanLoadMore = false;
      trlPage = 0;
      setLoader(true)
      getTeamListFromServer(true)
    }
  }, [route])



  const onSearchPress = () => {
    trlCanLoadMore = false;
    trlPage = 0;
    setSearchLoader(true);
    getTeamListFromServer(true)
  }

  const onRefresh = () => {
    trlCanLoadMore = false;
    trlPage = 0;
    setRefreshing(true)
    getTeamListFromServer(true)
  }

  const loadMore = () => {
    if (trlCanLoadMore) {
      trlCanLoadMore = false;
      setFooterLoader(true);
      getTeamListFromServer()
    }
  }





  //! //////// API
  const getTeamListFromServer = async (newArray = false) => {
    let res = await SALE_TRANSACTION_LIST({
      token, navigation, page: trlPage, searchText: searchText.trim()
    });
    if (res.code == 200) {
      let length = newArray ? res?.transaction.length : list.length + res?.transaction.length;
      if (length < res?.total_member_count) {
        trlPage++;
        trlCanLoadMore = true;
      } else {
        trlCanLoadMore = false;
      }
      setTotal(res?.total_member_count)
      setLoader(false);
      setList(newArray ? res?.transaction : [...list, ...res?.transaction]);
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







  const memberListView = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <MemberView
              member={item?.affiliate_user_info}
            // customImage={item?.image?.thumbnail_1}
            />
          </View>

        </View>
        <View style={{ padding: 5 }}>
          <StatView title={"Amount"} value={prependCurency(item?.currency) + " " + (!!item?.amount ? item?.amount.toFixed(2) : "0")} />
          <StatView title={"Transaction Type"} value={item?.method} />
          <StatView title={"Date"} value={item?.transaction_date} uppercase />

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


  return (
    <RootView hideSubHeader>
      {topView()}
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          ListEmptyComponent={!loader && <EmptyView label={"No Commission Found!"} />}
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
      <FAB onPress={() => navigation.navigate(routes.salesTeamTransactionsAddEditScreen, { member: undefined })} />


    </RootView>
  )
}

export default TeamList


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