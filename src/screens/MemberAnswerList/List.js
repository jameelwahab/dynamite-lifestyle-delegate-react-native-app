import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_MEMBERS_ANSWERS_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import EmptyView from '../../components/EmptyView'
import FooterLoader from '../../components/FooterLoader'
import { colors } from '../../utilities/colors'
import SearchView from '../../components/SearchView'
import UserImage from '../../components/UserImage'
import StatView from '../Members/Components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
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
  const [title] = useState(navbar?.find(x => x.value == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true)
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [total, setTotal] = useState(0)
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })
  const [filters, setFilters] = useState({ createdFor: null });

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    setTimeout(() => {
      if (opt.type == "answers") {
        onAnswerScreen(item)
      }
    }, 200);
  }

  const onAnswerScreen = (item) => {
    navigation.navigate(routes?.genericQestionListing, {
      created_for: item?.created_for,
      id: item?.created_for_id,
      memberId: item?.member_id
    })
  }

  const onFilterScreen = () => {
    navigation.navigate(routes?.memberAnswersFilter, {
      filters,
    })
  }




  useEffect(() => {
    callAPI()
  }, [JSON.stringify(filters)])

  useEffect(() => {
    if (!!appliedFilters) {
      setFilters(appliedFilters)
    }
  }, [route])



  const callAPI = () => {
    setLoader(true);
    setList([])
    setTotal(0)
    page = 0;
    canLoadMore = false;
    getDataFromServer()
  }

  const onSerachPress = () => {
    setSearchLoader(true);
    setList([])
    callAPI();
  }

  const loadMore = () => {
    if (canLoadMore && page != 0) {
      canLoadMore = false;
      setFooterLoader(true);
      getDataFromServer()
    }
  }

  const getDataFromServer = async () => {
    let res = await GET_MEMBERS_ANSWERS_LIST({ navigation, token, page, created_for: filters?.createdFor?.created_for, search_text: searchText });
    if (res.code == 200) {
      let isFirstTime = page == 0;
      let totalItems = isFirstTime ? res?.members.length : (list.length + res?.members.length);
      if (res?.toal_count > totalItems) {
        canLoadMore = true;
        page = page + 1;
      } else {
        canLoadMore = false;
      }
      setList(isFirstTime ? res?.members : [...list, ...res?.members])
      setLoader(false)
      setFooterLoader(false);
      setSearchLoader(false);
      setTotal(res?.toal_count)
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
          <View style={[__styles.filterView, { flex: 1, paddingBottom: 5, alignItems: "center", justifyContent: "space-between" }]}>

            {!!filters?.createdFor &&
              <MyChip
                title={filters?.createdFor?.title}
                onPress={() => setFilters({ ...filters, createdFor: null })}
              />
            }
            {(!!filters?.createdFor) &&
              <TouchableOpacity
                onPress={() => setFilters({ ...filters, createdFor: null })}
                style={{ marginLeft: 10, borderWidth: 1, borderColor: colors.delete, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.heart + "33", alignSelf: "flex-end", }}>
                <MyText color={colors.delete}>{"Clear Filter"}</MyText>
              </TouchableOpacity>}

          </View>


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
            image={item?.profile_image}
            name={item?.first_name}
            backgroundTransparent
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText type='medium' >{item?.first_name + " " + item?.last_name}</MyText>
            <MyText fontSize={12} color={colors.lightText}>{item?.email}</MyText>
          </View>

          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => onAnswerScreen(item)} >
            <StatView title={"Question Created For"} value={item.created_for.replace(/[_-]/g, " ")} />
          </TouchableOpacity>
          <StatView title={"Module Title"} value={item?.title} />
          <StatView title={"Answered Date"} value={moment(item.reply_date).format(dateTimeFormat.date)} />


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
          onPress={onFilterScreen}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ flex: 0 }} >
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RootView hideBackBottomButton titleView={topView} >
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
  titleView: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center"
  },
  filterView: {
    flexDirection: "row",
    flexWrap: "wrap",
  }
})