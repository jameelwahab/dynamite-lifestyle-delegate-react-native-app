import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { GET_DAILY_STREAK_LIST } from '../../DAL'
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

let page = 0;
let canLoadMore = false;
const StreakAnalysis = ({ navigation, route }) => {

  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);

  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [settings, setSettings] = useState(null);
  const [collapsed, setCollapsed] = useState([]);
  const [streakScore, setStreakScore] = useState(0);
  const [filter, setFilter] = useState({
    date_from: "", date_to: ""
  })


  useEffect(() => {

    if (route?.params?.filters) {
      setFilter(route.params.filters)
    }
  }, [route])

  useEffect(() => {
    canLoadMore = false;
    page = 0;
    setLoader(true)
    getStreakList(true)
  }, [JSON.stringify(filter)])


  const onFilterScreen = () => {
    navigation.navigate(routes.performanceAnalysisFilterScreen, { filter, screen: route.name, })
  }





  const findCollapsed = (id) => {
    return !!collapsed.find(x => x == id)
  }

  const togggleCollapsed = (id) => {

    let index = collapsed.findIndex(x => x == id);
    if (index > -1) {
      collapsed.splice(index, 1);
    } else {
      collapsed.push(id)
    }
    setCollapsed([...collapsed])
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
    let res = await GET_DAILY_STREAK_LIST({
      navigation, token, page: page, body: {
        date_from: !!filter?.date_from ? moment(filter?.date_from).format(dateTimeFormat.date) : "",
        date_to: !!filter?.date_to ? moment(filter?.date_to).format(dateTimeFormat.date) : "",
      }
    });
    if (res.code == 200) {
      let length = newArray ? res?.past_activities.length : list.length + res?.past_activities.length;
      if (length < res?.total_past_activities) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(newArray ? res?.past_activities : [...list, ...res?.past_activities]);
      setSettings(res?.streak_performance_setting)
      setStreakScore(res?.streak_count);
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setRefreshing(false);
    }
  }

  const SliderView = (item, labelKey, valuekey) => {
    return (
      <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
        <MyText>{settings[labelKey]}</MyText>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
          <MyText>0</MyText>

          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Slider
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.white + "33"}
              thumbTintColor={colors.primary}
              thumbStyle={{ height: 20, width: 20 }}
              value={item[valuekey]}
              step={1}
              disabled={true}
              thumbProps={{
                children: (
                  <View style={__styles.thumb}>
                    <MyText color={colors.black}>{item[valuekey]}</MyText>
                  </View>
                ),
              }}
            />
          </View>

          <MyText>10</MyText>

        </View>
      </View>
    )
  }


  const AnalyticsView = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <Pressable
          onPress={() => togggleCollapsed(item?._id)}
          style={__styles.row}>
          <MyText>{"Activity Date : "}
            <MyText color={colors.primary} >{moment(item.date_time).format(dateTimeFormat.date)}</MyText> </MyText>


          <MyText>{settings?.total_score_text + " : "}
            <MyText color={colors.primary} >
              {item?.attitude_performance_rate + item?.desire_performance_rate + item?.discipline_performance_rate + item?.focus_performance_rate + item?.win_note_performance_rate}
            </MyText>
          </MyText>

          <View>
            {!findCollapsed(item?._id) ? icons.downwardArrow() : icons.upwardArrow()}
          </View>
        </Pressable>
        <Collapsible collapsed={!findCollapsed(item?._id)}>
          <View>
            {SliderView(item, "your_attitude_text", "attitude_performance_rate")}
            {SliderView(item, "your_focus_text", "focus_performance_rate")}
            {SliderView(item, "your_desire_text", "desire_performance_rate")}
            {SliderView(item, "your_discipline_text", "discipline_performance_rate")}
            {SliderView(item, "rate_this_win_text", "win_note_performance_rate")}
            {!!item?.win_note &&
              <View style={{ padding: 10 }}>
                <MyText type='bold' fontSize={18} >Win Info</MyText>
                <View style={{ marginTop: 10 }}>
                  <MyText >{item?.win_note}</MyText>
                </View>
              </View>}
          </View>

        </Collapsible>
      </View>
    )
  }

  const topview = () => {
    return (

      <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
        <View style={{ flex: 1 }}>
          <MyText isHeading >Streak Analytics</MyText>
        </View>
        <TouchableOpacity
          onPress={onFilterScreen}
        >
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>


      </View>
    )
  }

  const filterView = () => {

    return (
      <>
        {(!!filter?.date_from || !!filter?.date_to) &&
          <View style={{ flexDirection: "row" }}>
            <MyChip
              onPress={() => setFilter({ date_from: "", date_to: "" })}
              title={`${!!filter?.date_from ? "From : " + moment(filter?.date_from).format(dateTimeFormat.date) : ""} - ${!!filter?.date_to ? "To : " + moment(filter?.date_to).format(dateTimeFormat.date) : ""}`} />
          </View>}

        {!!settings && (streakScore != undefined || streakScore != null) &&
          <View style={{ alignItems: "flex-end" }}>
            <MyText color={colors.primary} >{`${settings["streack_count_text"]} : `}
              <MyText>{streakScore}</MyText>
            </MyText>
          </View>}
      </>


    )
  }

  return (
    <RootView titleView={topview}>
      {filterView()}
      <View style={{ flex: 1 }}>
        {!!settings &&
          <FlatList
            showsVerticalScrollIndicator={false}
            data={list}
            renderItem={AnalyticsView}
            onEndReached={loadMore}
            refreshControl={<MyRefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
            ListEmptyComponent={!loader && <EmptyView label={"Activities not found"} />}
          />}
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default StreakAnalysis

const __styles = StyleSheet.create({
  itemView: {
    // padding: 10,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.secondaryVariant,
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: colors.secondaryVariant,
    padding: 10
  },
  thumb: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    width: 20,
  },
})