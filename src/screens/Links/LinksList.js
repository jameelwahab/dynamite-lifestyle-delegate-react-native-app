import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyText from '../../components/MyText'
import RootView from '../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_LINKS_LIST } from '../../DAL'
import OptionModal from '../../components/OptionModal'
import StatView from '../Members/Components/StatView'
import MyLoader from '../../components/MyLoader'
import { icons } from '../../utilities/icons'
import EmptyView from '../../components/EmptyView'
import { colors } from '../../utilities/colors'
import { MenuButton, MyButton } from '../../components/MyButton'
import copyText from '../../functions/copyText'
import { websiteBaseUrl } from '../../utilities/constants'
import openUrl from '../../functions/openUrl'
import routes from '../../navigation/routes'
import SearchView from '../../components/SearchView'
import Tabs from '../../components/Tabs'
import FooterLoader from '../../components/FooterLoader'
import MyRefreshControl from '../../components/MyRefreshControl'

const LinksList = ({ navigation, route }) => {
  const { key } = route?.params;
  let pagination = useRef({ page: 0, canLoadMore: false })
  const { navbar } = useSelector(selectNavbar);
  const { token, user } = useSelector(selectUser);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [affiliate, setAffiliate] = useState(null)
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchText, setSearchText] = useState("")
  const [searchLoader, setSearchLoader] = useState(false);
  const [total, setTotal] = useState(0)
  const [footerLoader, setFooterLoader] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })


  useEffect(() => {
    pagination.current = { canLoadMore: false, page: 0 }
    setTotal(0)
    setList([])
    setLoader(true);
    getDataFromServer(true)
  }, [selectedTab])

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    if (opt?.type == "main" || opt?.type == "appointment") {
      setTimeout(() => {
        copy(item, opt.type)
      }, 200);
    } else if (opt?.type == "sub_team_access") {
      setTimeout(() => {
        navigation.navigate(routes.linksManageSubTeamAceess, {
          _id: item?._id,
          title: item?.sale_page_title
        })
      }, 400);
    } else {
      setTimeout(() => {
        navigation.navigate(routes.linksPaymentPlan, {
          _id: item?._id,
          title: item?.sale_page_title
        })
      }, 400);
    }
  }

  const loadMore = () => {
    if (pagination?.current?.canLoadMore) {
      pagination.current.canLoadMore = false;
      setFooterLoader(true);
      getDataFromServer();
    }
  }

  const onRefresh = () => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setRefreshing(true);
    getDataFromServer(true)
  }

  const onSearch = () => {
    pagination.current.page = 0;
    pagination.current.canLoadMore = false;
    setSearchLoader(true);
    getDataFromServer(true)
  }

  const getDataFromServer = async (newArray = false) => {
    let res = await GET_LINKS_LIST({
      navigation, token,
      pageType: tabs[selectedTab]?.id,
      page: pagination?.current?.page,
      searchText: searchText.trim()
    });
    if (res.code == 200) {
      let length = newArray ? res?.sale_pages.length : list.length + res?.sale_pages.length;
      if (length < res?.page_count) {
        pagination.current.page++;
        pagination.current.canLoadMore = true;
      } else {
        pagination.current.canLoadMore = false;
      }
      setList(newArray ? res?.sale_pages : [...list, ...res?.sale_pages])
      setAffiliate(res?.affiliate_object?.affiliate_url_name)
      setTotal(res?.page_count)
      setLoader(false)
      setFooterLoader(false)
      setRefreshing(false);
      setSearchLoader(false);
    } else {
      setLoader(false)
      setFooterLoader(false)
      setRefreshing(false);
      setSearchLoader(false);
    }
  }

  const copy = (item, type) => {
    let link = ""
    let msg = ""
    if (type == "appointment") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/appointment";
      msg = "Appointment URL copied to clipboard"
    } else if (type == "main") {
      link = websiteBaseUrl + item?.sale_page_title_slug
      msg = "Preview URL copied to clipboard"
    }
    copyText(link, msg)
  }

  const linkActon = (item, action) => {
    let link = ""
    let msg = ""
    if (item?.type_of_page == "book_a_call_page") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/appointment/" + affiliate;
      msg = "Appointment URL copied to clipboard"
    } else if (item?.type_of_page == "sale_page") {
      link = websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliate;
      msg = "Preview URL copied to clipboard"
    }

    if (action == "copy") {
      copyText(link, msg)
    } else if (action == "goto") {
      openUrl(link)
    }
  }

  const filter = (list) => {
    let item = optionModal?.selectedItem;
    console.log(item, "item")
    let newList = []
    if (item?.type_of_page == "sale_page") {
      newList = list.slice().filter(x => x.type != "appointment")
    } else if (user.team_type != "sub_team" && item?.plan_count > 0) {
      newList = [...list]
    } else {
      newList = list.slice().filter(x => x.type != "commission" && x.type != "sub_team_access")
    }
    return newList;

  }

  const copyView = (item) => (
    <TouchableOpacity
      onPress={() => linkActon(item, "copy")}
      style={__styles.copybtn} >
      <MyText color={colors.white} fontSize={12} type='medium'>
        {item?.type_of_page == "sale_page" ? "Copy Main URL " :
          item?.type_of_page == "book_a_call_page" ? "Copy Appointment URL " : ""}
      </MyText>
      {icons.copy(colors.primary, 15)}
    </TouchableOpacity>
  )

  const preview = (item) => (
    <TouchableOpacity
      onPress={() => openUrl(websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliate)}
      style={__styles.previewBtn} >
      <MyText color={colors.primary} >
        {"Preview "}
      </MyText>
      {icons.goto(colors.primary, 15)}
    </TouchableOpacity>
  )


  const renderLinks = ({ item, index }) => {
    return (
      <View style={__styles.cardView}>
        <View style={__styles.headerView}>
          <MyText>{index + 1})</MyText>
          {/* <View /> */}

          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          />
        </View>
        <StatView title={"Page Title"} value={item?.sale_page_title} />
        <StatView title={"Copy Url"} view={() => copyView(item)} />
        <StatView title={"URL"} view={() => preview(item)} />
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

  const listHeader = () => {
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


  return (
    <RootView hideBackBottomButton
      title={title}
      subTitle={`Showing ${list.length} of ${total}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          ListHeaderComponent={listHeader()}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          keyExtractor={(item) => item?._id}
          renderItem={renderLinks}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={!loader && <EmptyView />}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          onEndReached={loadMore}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />


      </View>


      <OptionModal
        optionList={filter(options)}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default LinksList

const tabs = [
  {
    id: "sale_page",
    index: 0,
    title: "SALE PAGES",
  },
  {
    id: "book_a_call_page",
    index: 1,
    title: "BOOKING PAGES",
  },

]


const options = [
  {
    icon: () => icons.eye(colors.primary, 17),
    title: "Copy Main URL",
    type: "main"
  },
  {
    icon: () => icons.eye(colors.primary, 17),
    title: "Copy Appointment URL",
    type: "appointment"
  },
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Set Commission",
    type: "commission"
  },
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Manage Sub Team Access",
    type: "sub_team_access"
  }]

const __styles = StyleSheet.create({
  cardView: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  copybtn: {
    borderWidth: 1,
    borderColor: colors.lightText + "AA",
    borderRadius: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  previewBtn: {
    flexDirection: "row",
    alignItems: "center"
    // borderWidth: 1,
    // borderColor: colors.primary,
    // borderRadius: 20,
    // alignSelf: "flex-start",
    // paddingHorizontal: 30,
    // paddingVertical: 5
  }
})