import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import MyText from '../../../components/MyText'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_TRANSACTIONS_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import MyImage from '../../../components/MyImage'
import UserImage from '../../../components/UserImage'
import StatView from '../../Members/Components/StatView'
import TransactionView from './components/TransactionView'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import MyInputs from '../../../components/MyInputs'
import SearchView from '../../../components/SearchView'
import EmptyView from '../../../components/EmptyView'
import FooterLoader from '../../../components/FooterLoader'
import MyChip from '../../../components/MyChip'


let page = 0;
let canLoadMore = false;
const Transactions = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone)
  const [title] = useState(navbar?.find(x => x.value == parentKey)?.child_options?.find(y => y.value == key)?.title);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [searchText, setSearchText] = useState("")
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0)
  const [mode, setMode] = useState(null)

  const api_transaction_list = async (newArray = false) => {
    let res = await GET_TRANSACTIONS_LIST({
      navigation, token, page, search_text: searchText.trim(), transaction_mode: !!mode ? mode.key : "all"
    })
    if (res.code == 200) {
      if ((list.length + res?.transaction.length) < res?.total_member_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_member_count)
      setList(newArray ? res?.transaction : [...list, ...res?.transaction]);
      setLoader(false);
      setFooterLoader(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
    }
  }

  const changeMode = (selectedMode) => {
    setMode(selectedMode)
  }

  const onFilterScreen = () => {
    navigation.navigate(routes.transactionfilterScreen, {
      mode: mode,
      changeMode: changeMode,
      title: title
    })
  }

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      api_transaction_list()
    }
  }
  const onSearchBtnPress = () => {
    page = 0;
    canLoadMore = false;
    setTotal(0)
    setList([])
    setLoader(true);
    api_transaction_list(true)
  }

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setTotal(0)
    setList([])
    setLoader(true);
    api_transaction_list(true)

    return () => {
      page = 0;
      canLoadMore = false;
    }
  }, [mode])




  const topView = () => {
    return (
      <View style={__styles.topView}>
        <View style={__styles.headingView}>
          <View style={{ flex: 1 }}>
            <MyText fontSize={18} type='bold' color={colors.primary} >{title}</MyText>
            <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Showing ${list.length} of ${total}`}</MyText>
          </View>



          <TouchableOpacity
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            onPress={onFilterScreen}
          >
            {icons.filterCircle(colors.primary, 25)}
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  const headerView = () => {
    return (
      <View style={__styles.headerView}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MyText type='bold' >Filtered By:</MyText>
          {mode == null || mode.key == "all" ? <MyChip title={"All"} /> :
            <MyChip title={mode?.title} onPress={() => setMode(null)} />}
        </View>
        <View style={{ paddingBottom: 15 }}>
          <SearchView
            search={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSearchPress={onSearchBtnPress}
          />
        </View>
      </View>
    )
  }


  return (
    <RootView titleView={topView} hideBackBottomButton>
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          onEndReached={loadMore}
          data={list}
          renderItem={({ item, index }) => <TransactionView item={item} index={index} timezone={timezone} />}
          ListEmptyComponent={!loader && <EmptyView label={"No Transactions Found"} />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
        />

      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default Transactions;

const __styles = StyleSheet.create({
  topView: { paddingHorizontal: 10 },
  headingView: { flexDirection: "row", alignItems: "center", },
  headerView: {
    paddingHorizontal: 5,
    backgroundColor: colors.darkSecondary
  }
})