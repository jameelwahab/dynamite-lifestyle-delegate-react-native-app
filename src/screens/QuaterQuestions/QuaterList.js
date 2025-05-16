import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_DAILY_STREAK_LIST, GET_QUATER_QUESTION_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import moment from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
import { icons } from '../../utilities/icons'
import { Slider } from '@rneui/themed';
import MyRefreshControl from '../../components/MyRefreshControl'
import EmptyView from '../../components/EmptyView'
import Collapsible from 'react-native-collapsible'
import routes from '../../navigation/routes'
import MyChip from '../../components/MyChip'
import FooterLoader from '../../components/FooterLoader'
import { selectNavbar } from '../../redux/reducers/navbarSlice'

let page = 0;
let canLoadMore = false;
const QuaterList = ({ navigation, route }) => {
  const { value } = route?.params
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x.value == value)?.title);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    canLoadMore = false;
    page = 0;
    setLoader(true)
    getStreakList(true)
  }, [])



  const onQuestionDetail = (item) => {
    navigation.navigate(routes.quaterQuestionDetail, {
      createdFor: "quarter",
      createdForId: item?._id,
      title: item?.title,
      description: item?.detailed_description
    })
  }


  //! APIs

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getStreakList()
    }
  }

  const onRefresh = () => {
    page = 0;
    canLoadMore = false;
    setRefreshing(true)
    getStreakList(true)
  }

  const getStreakList = async (newArray = false) => {
    let res = await GET_QUATER_QUESTION_LIST({
      navigation, token, page: page,
    });
    if (res.code == 200) {
      let length = newArray ? res?.quarter.length : list.length + res?.quarter.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(newArray ? res?.quarter : [...list, ...res?.quarter]);
      setTotal(res?.total_count);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    }
  }



  const QuaterView = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onQuestionDetail(item)}
        style={__styles.itemView}>
        <View style={__styles.row}>
          <View style={{ flex: 1 }}>
            <MyText>{item?.title}</MyText>
          </View>


          <View style={{ transform: [{ rotateZ: "-90deg" }] }}>
            {icons.downwardArrow()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }



  return (
    <RootView hideBackBottomButton title={title}
      subTitle={`Showing ${list.length} of ${total}`}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={list}
          renderItem={QuaterView}
          onEndReached={loadMore}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          ListEmptyComponent={!loader && <EmptyView label={"Questions not found"} />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default QuaterList

const __styles = StyleSheet.create({
  itemView: {
    // padding: 10,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.white + "22",
    backgroundColor: colors.secondaryVariant,
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 10
    // overflow:"hidden"
  },
  thumb: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    width: 20,
  },
})