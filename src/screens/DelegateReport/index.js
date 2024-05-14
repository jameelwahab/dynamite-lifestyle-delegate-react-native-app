import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { FlatList } from 'react-native'
import EmptyView from '../../components/EmptyView'
import MyLoader from '../../components/MyLoader'
import Tabs from '../../components/Tabs'
import { GET_DELEGATE_REPORT_LIST } from '../../DAL'
import { colors } from '../../utilities/colors'
import UserImage from '../../components/UserImage'
import MemberView from '../../components/MemberView'
import { icons } from '../../utilities/icons'
import { GET_SALES_PERDORMANCE } from '../../DAL/DelegateReport'
import StatView from '../Members/Components/StatView'
import prependCurency from '../../functions/prependCurency'
import Collapsible from 'react-native-collapsible'


let page = 0;
let canLoadMore = false;

const DelegateReport = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("")
  const [selectedTab, setSelectedTab] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0)


  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setList([])
    setLoader(true);
    if (selectedTab == 1) {
      getPerformance(true)
    } else {
      getDelegateReport(true)
    }
  }, [selectedTab])


  //! ////// APIs

  const getDelegateReport = async (newArray = false) => {
    let res = await GET_DELEGATE_REPORT_LIST({
      navigation, token, page: 0, body: {
        created_for: undefined,
        end_date: undefined,
        search_text: "",
        start_date: undefined,
        type: tabs[selectedTab].type
      },
    });

    setLoader(false);

    if (res.code == 200) {
      let length = newArray ? res?.delegate.length : list.length + res?.delegate.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setTotal(res?.total_count)
      setList(newArray ? res?.delegate : [...list, ...res?.delegate]);
    }
  }

  const getPerformance = async (newArray = false) => {
    let res = await GET_SALES_PERDORMANCE({
      navigation, token, page: 0, body: {
        created_for: undefined,
        end_date: undefined,
        search_text: "",
        start_date: undefined,
        type: tabs[selectedTab].type
      },
    });

    setLoader(false);

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
    }
  }


  const onItemPress = (item, index) => {
    setSelectedIndex(index)
  }



  const headerView = () => {
    return (
      <View>
        <Tabs
          list={tabs}
          changeTab={(index) => setSelectedTab(index)}
          tab={selectedTab}
        />
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
          <View style={__styles.countView}>
            <MyText fontSize={12} color={colors.primary} >{item?.dynamite_streak_performance_count}</MyText>
          </View>
          <View style={__styles.arrowView}>
            {selectedIndex == index ? icons.upwardArrow() : icons.downwardArrow()}
          </View>
        </Pressable>
        <Collapsible collapsed={selectedIndex != index} >
          <View style={{ height: 200 }} />
        </Collapsible>
      </View>
    )
  }

  const renderSaleItem = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
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

  return (
    <RootView hideBackBottomButton title={title}
      subTitle={`Showing ${list.length} from ${total}`}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          // renderItem={selectedIndex == 1 ? renderSaleItem : renderItem}
          renderItem={render}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          ListHeaderComponent={headerView()}
        />
      </View>


      <MyLoader style={{ top: 100 }} enable={loader} />
    </RootView>
  )
}

export default DelegateReport;


const tabs = [
  {
    id: "streak_performance",
    index: 0,
    title: "STREAK PERFORMANCE",
    type: undefined
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
    padding: 10,
    backgroundColor: colors.secondary,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  header: {
    flexDirection: "row",

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
  }
})
