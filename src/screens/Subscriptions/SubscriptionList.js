import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_MEMBERS_ANSWERS_LIST, GET_SUBSCRIPTION_LIST_OF_MEMBERS } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import EmptyView from '../../components/EmptyView'
import FooterLoader from '../../components/FooterLoader'
import { colors } from '../../utilities/colors'
import SearchView from '../../components/SearchView'
import UserImage from '../../components/UserImage'
import StatView from '../Members/Components/StatView'
import moment from 'moment'
import { dateTimeFormat, isDev } from '../../utilities/constants'
import { MenuButton } from '../../components/MyButton'
import routes from '../../navigation/routes'
import OptionModal from '../../components/OptionModal'
import { icons } from '../../utilities/icons'
import MyChip from '../../components/MyChip'

let page = 0;
let canLoadMore = false;
const List = ({ navigation, route }) => {
  const { key, appliedFilters } = route?.params;
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true)
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [total, setTotal] = useState(0)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  });
  const [filters, setFilters] = useState({
    mode: isDev ? { title: "SandBox", key: "sandBox", } : { title: "Live", key: "live", }
    , page: null, plan: null
  });

  const clearFilter = () => {
    setFilters({ mode: null, page: null, plan: null });
  }

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    setTimeout(() => {
      if (opt.type == "answers") {
        onAnswerScreen(item)
      }
    }, 200);
  }

  const onAnswerScreen = () => {
    navigation.navigate(routes?.subscriptionFilter, {
      filters,
    })
  }



  useEffect(() => {
    console.log(route?.params?.appliedFilters, "route")
    if (!!route?.params?.appliedFilters) {
      setFilters(route?.params?.appliedFilters);
    } else {
      callAPI()
    }
  }, [route])


  useEffect(() => {
    if (!!filters) {
      setList([]);
      callAPI()
    }
  }, [JSON.stringify(filters)])


  const callAPI = () => {
    setLoader(true)
    page = 0;
    canLoadMore = false;
    getDataFromServer()
  }

  const onSerachPress = () => {
    setSearchLoader(true);
    page = 0;
    canLoadMore = false;
    getDataFromServer()
  }

  const loadMore = () => {
    if (canLoadMore && page != 0) {
      canLoadMore = false;
      setFooterLoader(true);
      getDataFromServer()
    }
  }

  const getDataFromServer = async () => {
    let res = await GET_SUBSCRIPTION_LIST_OF_MEMBERS({
      navigation, token, page,
      search_text: searchText,
      filter: !!filters?.mode ? filters?.mode?.key : "",
      payment_plan: !!filters?.plan ? filters?.plan?._id : "",
      sale_page: !!filters?.page ? filters?.page?._id : ""
    });
    if (res.code == 200) {
      let isFirstTime = page == 0;
      let totalItems = isFirstTime ? res?.subscription.length : (list.length + res?.subscription.length);
      if (res?.total_subscription_count > totalItems) {
        canLoadMore = true;
        page = page + 1;
      } else {
        canLoadMore = false;
      }
      setList(isFirstTime ? res?.subscription : [...list, ...res?.subscription])
      setLoader(false)
      setFooterLoader(false);
      setSearchLoader(false);
      setTotal(res?.total_subscription_count)
    } else {
      setLoader(false)
      setFooterLoader(false);
      setSearchLoader(false);
    }
  }

  const headerView = () => {
    return (
      <View style={__styles.headerView}>
        <View style={__styles.filterView}>
          <View style={[__styles.filterView, __styles.filterViewWithbtn]}>

            {!!filters?.page &&
              <MyChip
                title={!!filters?.page ? `${filters?.page?.sale_page_title} ${appliedFilters?.page?.type == "template" ? " (Template) " : ""}` : ""}
                onPress={() => setFilters({ ...filters, plan: null, page: null })}
              />
            }
            {!!filters?.plan &&
              <MyChip title={filters?.plan?.plan_title}
                onPress={() => setFilters({ ...filters, page: null })} />
            }
            {!!filters?.mode &&
              <MyChip
                title={filters?.mode?.title}
                onPress={() => setFilters({ ...filters, mode: null })} />
            }


          </View>
          {(!!filters?.mode || !!filters?.plan || !!filters?.page) &&
            <TouchableOpacity
              onPress={clearFilter}
              style={{ marginRight: 10, borderWidth: 1, borderColor: colors.delete, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.heart + "33", alignSelf: "flex-end", marginBottom: 5 }}>
              <MyText color={colors.delete}>{"Clear Filter"}</MyText>
            </TouchableOpacity>}

        </View>

        <View>
          <SearchView
            loader={searchLoader}
            onChangeText={(text) => setSearchText(text)}
            search={searchText}
            onSearchPress={onSerachPress}
          />
        </View>
      </View>
    )
  }


  const renderAnswrs = ({ item, index }) => {
    return (
      <View style={__styles.itemRootView}>
        <View style={__styles.itemHead} >
          <UserImage
            size={35}
            image={item?.member?.profile_image}
            name={item?.member?.first_name}
            backgroundTransparent
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText type='medium' >{item?.member?.first_name + " " + item?.member?.last_name}</MyText>
            <MyText fontSize={12} color={colors.lightText}>{item?.member?.email}</MyText>
          </View>

          {/* <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          /> */}
        </View>
        <View style={{ marginTop: 10 }}>
          <StatView title={"Page Title"} value={!!item?.sale_page?.sale_page_title ? item?.sale_page?.sale_page_title : "N/A"} />
          <StatView title={"Plan Title"} value={!!item?.plan?.plan_title ? item?.plan?.plan_title : "N/A"} />
          <StatView title={"Subscription Mode"} value={item?.stripe_mode} />
          <StatView title={"Next Invoice Date"} value={moment(item?.next_invoice_date).format(dateTimeFormat.date)} />
          <StatView title={"Subscription Date"} value={moment(item?.subscription_date).format(dateTimeFormat.date)} />


        </View>
      </View>)
  }

  const topView = () => {
    return (
      <View style={__styles.titleView}>
        <View style={{ flex: 1 }}>
          <MyText fontSize={18} type='bold' color={colors.primary} >{title}</MyText>
          <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Showing ${list.length} of ${total}`}</MyText>
        </View>

        <TouchableOpacity
          onPress={onAnswerScreen}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ flex: 0 }} >
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RootView
      hideBackBottomButton
      titleView={topView}>
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          data={list}
          renderItem={renderAnswrs}
          keyExtractor={(item, index) => item?._id + index}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={!loader && <EmptyView />}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />


      </View>

      <OptionModal
        optionList={options}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default List;

const options = [
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Answer's Detail",
    type: "answers"
  }]

const __styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  itemHead: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemImage: { height: 50, width: 50, borderRadius: 50 / 2, overflow: "hidden" },
  headerView: {
    paddingBottom: 10,
    backgroundColor: colors.darkSecondary
  },
  filterView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterViewWithbtn: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 5,
    flexWrap: "wrap",
    alignContent: "space-between"
  },
  titleView: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center"
  }
})