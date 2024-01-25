import { View, Text, Pressable, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { MEMBER_PROFILE } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import moment from 'moment'
import MyLoader from '../../../components/MyLoader'
import MemberView from '../../../components/MemberView'
import { icons } from '../../../utilities/icons'
import { __styles } from './style'
import { colors } from '../../../utilities/colors'
import StatView from './StatView'
import WheelofLife from './WheelofLife'
import QuestionsView from './QuestionsView'
import SubscriptionVIew from './SubscriptionVIew'
import NinetyDaysView from './NinetyDaysView'
import CalenderView from './CalenderView'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { onChatScreen } from '../../../functions/onChatScreen'
import DailyDynamiteGraph from './DailyDynamiteGraph'


const MemberProfile = ({ navigation, route }) => {
  let { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone)
  const { memberId } = route?.params
  const tabRef = useRef()
  const [loader, setLoader] = useState(false);
  const [member, setMember] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedTab, setSelectedTab] = useState(tabs[0].key);
  const [events, setEvents] = useState(null);
  const [type, setType] = useState('month')
  const [_90DayGraph, set_90DayGraph] = useState([])
  const geMemberDataFromServer = async (selectedDate, ttype) => {
    let sDATE = moment(selectedDate).subtract({ month: 1 }).endOf(ttype).format('YYYY-MM-DD');
    let eDATE = moment(selectedDate).endOf(ttype).format('YYYY-MM-DD');
    let res = await MEMBER_PROFILE({ token, navigation, memberId: memberId, startDate: sDATE, endDate: eDATE })
    if (res.code == 200) {


      //? make Calendar data
      let startDate = moment(selectedDate, "YYYY-MM-DD").startOf(ttype);
      let endDate = moment(selectedDate, "YYYY-MM-DD").endOf(ttype)
      let newArray = {};
      let diff = moment(endDate).diff(moment(startDate), "days") + 1;
      for (let i = 0; i < diff; i++) {
        let curDate = moment(startDate).add({ day: i }).format("YYYY-MM-DD");
        let list = res.event.filter(x => convertTimezone(x?.start_date_time, timezone).format("YYYY-MM-DD") == curDate);
        newArray[curDate] = {
          count: list.length,
          list: list
        }
      }


      //? make graph data
      let graphData = res?.member_earning_app.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      let newlist = [];
      graphData.forEach((x, i) => {
        let index = newlist.findIndex(y => y.date === x.date);
        if (index == -1) {
          let day
          if (i == 0) {
            day = 1;
          } else {
            day = moment(x.date, "YYYY-MM-DD").diff(moment(graphData[0].date, "YYYY-MM-DD"), "day");
          }

          let newObj = {
            date: x.date,
            earning: x.earning,
            day: day
          }
          newlist.push(newObj)
        } else {
          let newObj = { ...newlist[index], earning: newlist[index].earning + x.earning };
          newlist.splice(index, 1, newObj);
        }
      })

      console.log(newlist, "newlist")
      set_90DayGraph(newlist);
      setEvents(newArray)
      setMember(res)
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const onArrowPress = (btnType) => {
    let newDate;
    if (btnType == "prev") {
      newDate = moment(date).subtract(type, 1).format("YYYY-MM-DD");
    } else if (btnType == "next") {
      newDate = moment(date).add(type, 1).format("YYYY-MM-DD");
    }
    setEvents(null)
    setDate(newDate);
    setLoader(true);
    geMemberDataFromServer(newDate, type);
  }


  const onTypePress = (ntype) => {
    setEvents(null)
    setType(ntype);
    setLoader(true);
    geMemberDataFromServer(date, ntype);
  }

  useEffect(() => {
    setLoader(true);
    geMemberDataFromServer(date, type)
  }, [])

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 15 }}>
        <View style={{ flex: 1 }}>
          {!!member?.member && <MemberView member={member?.member} showPhoneNumber />}
        </View>
        <Pressable style={__styles.topBtn}>
          {icons.whatsapp(colors.primary, 22)}
        </Pressable>
        <Pressable
          onPress={() => onChatScreen(memberId, token, navigation, user?._id)}
          style={__styles.topBtn}>
          {icons.message(colors.primary, 22)}
        </Pressable>
      </View>
    )
  }

  const TabView = () => {
    return (
      <View style={{ marginVertical: 10, height: 40, justifyContent: "center" }}>

        <FlatList
          ref={tabRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  tabRef?.current?.scrollToIndex({ index: index, animated: true });
                  setSelectedTab(item.key)
                }}
                style={{ paddingHorizontal: 10, justifyContent: "flex-end" }}>
                <MyText color={item.key == selectedTab ? colors.primary : colors.lightText2} type='medium' fontSize={16} >{item.title}</MyText>
                <View style={{ height: 2, width: "100%", marginTop: 2, borderRadius: 10, backgroundColor: item.key == selectedTab ? colors.primary : colors.transparent }} />

              </TouchableOpacity>
            )
          }}
        />
        <View style={{
          height: 1,
          backgroundColor: colors.darkSecondary,
          shadowColor: colors.lightText2,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.20,
          shadowRadius: 1.41,
          elevation: 2
        }} />
      </View>
    )
  }

  const showScreen = () => {
    return (
      <View>
        {selectedTab == "wol" ?
          <WheelofLife member={member?.member} settings={member?.wheel_of_life_setting} />
          : selectedTab == "question" ?
            <QuestionsView member={member} />
            : selectedTab == "subscription" ?
              <SubscriptionVIew list={member?.subscribers} />
              : selectedTab == "90days" ?
                <NinetyDaysView member={member} graphData={_90DayGraph} />
                : selectedTab == "calendar" && events != null ?
                  <CalenderView
                    onArrowPress={onArrowPress}
                    timezone={timezone}
                    events={events}
                    member={member}
                    selectedDate={date}
                    setDate={setDate}
                    type={type}
                    setType={onTypePress}
                    loader={loader}
                  />
                  : selectedTab == "daily-dynamite-graph" ?
                    <DailyDynamiteGraph />
                    : null}
      </View>
    )
  }

  return (
    <RootView titleView={!!member ? () => topView() : undefined} >
      {!!member &&
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <StatView member={member} />
            {TabView()}
            {showScreen()}
          </ScrollView>
        </View>}
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MemberProfile

const tabs = [{
  key: "wol",
  title: "Wheel of Life",
},
{
  key: "question",
  title: "Questions",
},
{
  key: "90days",
  title: "90 Days",
},
{
  key: "subscription",
  title: "Subscriptions",
},
{
  key: "daily-dynamite-graph",
  title: "Intentions Analysis",
},
{
  key: "calendar",
  title: "Calendar Events",
}
]