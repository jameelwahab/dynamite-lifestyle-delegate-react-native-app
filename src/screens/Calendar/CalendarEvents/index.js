import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectNavbar } from '../../../redux/reducers/navbarSlice';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import { selectUser } from '../../../redux/reducers/userSlice';
import { Calendar } from 'react-native-calendars';
import { colors } from '../../../utilities/colors';
import { fonts } from '../../../utilities/fonts';
import moment from 'moment';
import MyLoader from '../../../components/MyLoader';
import { GET_ALL_CALENDAR_EVENTS_LIST, GET_CALENDAR_EVENTS_LIST } from '../../../DAL';
import { convertTimezone2 } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { dateTimeFormat } from '../../../utilities/constants';
import EmptyView from '../../../components/EmptyView';
import { MenuButton, TransparentButton } from '../../../components/MyButton';
import { icons } from '../../../utilities/icons';
import FAB from '../../../components/FAB';
import routes from '../../../navigation/routes';
import TitleView from '../../../components/TitleView';
import StatView from '../../../components/StatView';
import OptionModal from '../../../components/OptionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';



const dateStringCalendar = "YYYY-MM-DD";
const CalendarScreen = ({ navigation, route }) => {
  const { key, parentKey, type: eventType } = route?.params;
  const isDelegateEvents = eventType == "consultant_user";
  const { token,user } = useSelector(selectUser);
  console.log(user,"user")
  const { navbar } = useSelector(selectNavbar);
  const timezone = useSelector(selectTimeZone);
  const [title] = useState(isDelegateEvents ?
    navbar?.find(x => x._id == key)?.title
    : navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
    console.log(title,'title')
  const [curDate, setCurDate] = useState(moment().format(dateStringCalendar));
  const [loader, setLoader] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState({})
  const [eventList, setEventList] = useState([]);
  const [type, setType] = useState("month");
  const [viewType, setViewType] = useState("calendar");
  const [seeMore, setSeeMore] = useState({});
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })


  useEffect(() => {
    callAPI()
  }, [moment(curDate).format("MM-YYYY"), type, viewType])

  useEffect(() => {
    if (type == "week" || type == "day") {
      callAPI()
    }
  }, [curDate])


  useEffect(() => {
    if (route?.params?.refresh) {
      callAPI()
    }
  }, [route])



  const callAPI = () => {
    setLoader(true);
    setEventList([])
    setCalendarEvents({})
    if (viewType == "calendar") {
      getCalendarEventsLists()
    } else if (viewType == "list") {
      getAllCalendarEventsLists()
    }
  }

  const getCalendarEventsLists = async () => {
    setLoader(true);
    let start_date = moment(curDate).startOf(type).format(dateStringCalendar);
    let end_date = moment(curDate).endOf(type).format(dateStringCalendar);
    let res = await GET_CALENDAR_EVENTS_LIST({
      navigation, token, body: { created_for: eventType, end_date, start_date, }
    });

    if (res.code == 200) {
      let newArray = {};
      let diff = moment(end_date).diff(moment(start_date), "days") + 1;
      for (let i = 0; i < diff; i++) {
        let date = moment(start_date).add({ day: i }).format("YYYY-MM-DD")
        let list = res.event.filter(x => convertTimezone2(x?.start_date_time, timezone).format(dateStringCalendar) == date);
        let count = list.length;
        if (count > 0) {
          newArray[date] = {
            count: count,
            list: list
          }
        }
      }
      setCalendarEvents(newArray);
      setLoader(false);
    } else {
      setLoader(false);
    }

  }

  const getAllCalendarEventsLists = async () => {
    setLoader(true);
    let res = await GET_ALL_CALENDAR_EVENTS_LIST({ navigation, token, });
    if (res.code == 200) {
      setEventList(res?.event)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }




  //? Options functions

  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {
      deleteEventFromServer(item)
    }, 350);
  }

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        navigation.navigate(routes.calendarEventsAddEdit, { event: item, iterationId: undefined });
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      } else if (opt.key == "detail") {
        onGrpDetail(item)
      }
    }, 400);
  }


  //? //////// functions
  const onEventDetail = (evt) => {
    navigation.navigate(routes.calendarEventDetail, {
      eventId: evt.event_id,
      iteration_id: evt._id
    })
  }
  const onAddEventScreen = () => {
    navigation.navigate(routes.calendarEventsAddEdit, { event: undefined, iterationId: undefined })
  }

  const onBackPress = () => {
    setCurDate((date) => moment(date).subtract(type, 1).format(dateStringCalendar))
  }

  const onNextPress = () => {
    setCurDate((date) => moment(date).add(type, 1).format(dateStringCalendar))
  }

  const toggleSee = (id) => {
    if (seeMore[id]) {
      delete seeMore[id]
    } else {
      seeMore[id] = true
    }
    setSeeMore({ ...seeMore })
  }


  //* /////////// Views

  const topView = () => {
    return (
      <View style={__styles.topView}>

        {/* <View style={__styles.googleBnt} >
          <Image source={icons.googleCalendar}
            style={{ height: 20, width: 20 }} />
          <View style={{  marginLeft: 10 }}>
            <MyText color={colors.black} >Sync with Google Calendar</MyText>
          </View>
        </View> */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <View style={__styles.mergeButtons}>
            <TouchableOpacity
              onPress={() => setType("month")}
              style={__styles.mergeButtonView}>
              <MyText
                style={__styles.mergeButtonText}
                color={type == "month" ? colors.primary : colors.white}
              >month</MyText>
            </TouchableOpacity>
            <View style={__styles.divider} />
            <TouchableOpacity
              onPress={() => setType("week")}
              style={__styles.mergeButtonView}>
              <MyText style={__styles.mergeButtonText}
                color={type == "week" ? colors.primary : colors.white}
              >week</MyText>
            </TouchableOpacity>
            <View style={__styles.divider} />
            <TouchableOpacity
              onPress={() => setType("day")}
              style={__styles.mergeButtonView}>
              <MyText
                color={type == "day" ? colors.primary : colors.white}
                style={__styles.mergeButtonText} >day</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const calendarView = () => {
    return (
      <View style={__styles.calendarView}>
        <Calendar
          initialDate={curDate}
          theme={__styles.calendarTheme}
          dayComponent={({ date, state }) => {
            let textColor = curDate == date.dateString ? colors.black : state == "today" ? colors.primary : colors.white;
            let bgColor = curDate == date.dateString ? colors.primary : colors.transparent;
            return (
              <TouchableOpacity
                onPress={() => setCurDate(date.dateString)}
                style={[__styles.dayCircle, { backgroundColor: bgColor }]}>
                <MyText color={textColor}>{date?.day}</MyText>
                {calendarEvents[date?.dateString]?.count > 0 &&
                  <MyText color={textColor} fontSize={10}>{calendarEvents[date?.dateString]?.count} </MyText>}
              </TouchableOpacity>
            )
          }}
          hideExtraDays={true}
          onMonthChange={(date) => setCurDate(date.dateString)}
          renderHeader={(date) =>
            <MyText fontSize={16} type='medium' >{moment(curDate).format("MMM YYYY")}</MyText>}
        />
      </View>
    )
  }

  const subHeadingView = () => {
    return (
      <View style={__styles.headingRow} >
        <TransparentButton
          onPress={onBackPress}
          icon={icons.backwardArrow} />
        <View style={__styles.headingText}>
          <MyText color={colors.primary} type='medium' fontSize={16} >{type == "week" ?
            moment(curDate).startOf("week").format(dateTimeFormat.date) + "  -  " + moment(curDate).endOf("week").format(dateTimeFormat.date)
            : moment(curDate).format(dateTimeFormat.date)}</MyText>
          {/* <MyText>{moment(curDate).startOf("week").format("dddd") + "  -  " + moment(curDate).endOf("week").format("dddd")}</MyText> */}
        </View>
        <TransparentButton
          onPress={onNextPress}
          icon={icons.forwardArrow} />
      </View>
    )
  }


  const headerView = () => {
    return (
      <>
        {topView()}
        {type == "month" && !loader && calendarView()}
        {type != "month" && subHeadingView()}
      </>
    )
  }

  const renderItem = ({ item, index }) => {
    if (type == "week") {
      return (
        <View style={[__styles.eventView,]}>
          <View style={__styles.weekDayView}>
            <MyText type='medium' color={colors.primary} >{moment(item).format("ddd")}</MyText>
            <MyText color={colors.primary}>{moment(item).format("MM") + "/" + moment(item).format("DD")}</MyText>
          </View>
          <View style={__styles.eventWeekView} >
            {calendarEvents[item]?.list.map((event,) => (
              <TouchableOpacity
                onPress={() => onEventDetail(event)}
                style={__styles.eventWeekRootView}>
                <View style={[__styles.eventColorView, { backgroundColor: event?.color }]} />
                <View style={__styles.eventTitleAndDetail}>
                  <MyText type='medium'>{event?.title}</MyText>
                  <View style={__styles.timeView}>
                    <MyText fontSize={10} >{convertTimezone2(event?.start_date_time, timezone).format(dateTimeFormat.time)}  -  {convertTimezone2(event?.end_date_time, timezone).format(dateTimeFormat.time)}</MyText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>)
    } else {
      return (
        <TouchableOpacity onPress={() => onEventDetail(item)}
          style={__styles.eventView}>
          <View style={[__styles.eventColorView, { backgroundColor: item?.color }]} />
          <View style={__styles.eventTitleAndDetail}>
            <MyText type='medium'>{item?.title}</MyText>
            <View style={__styles.timeView}>
              <MyText fontSize={10} >{convertTimezone2(item?.start_date_time, timezone).format(dateTimeFormat.time)}  -  {convertTimezone2(item?.end_date_time, timezone).format(dateTimeFormat.time)}</MyText>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
  }


  const eventView = (list, id) => {
    let count = list.length;
    return (
      <View style={{ paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        {list.map((x, i) => {
          if ((i >= 3 && seeMore[id]) || (i < 3))
            return (
              <MyText key={x?._id?._id} >{x?._id?.title},</MyText>
            )
        })}
        {count > 3 &&
          <TouchableOpacity onPress={() => toggleSee(id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
            <MyText underlined color={colors.primary} >{seeMore[id] ? "See Less" : "See More"}</MyText>
          </TouchableOpacity>}
      </View>)
  }


  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >
          {value ? "Active" : "Inactive"}
        </MyText>
      </View>)
  }

  const renderEventItem = ({ item, index }) => {
    return (
      <View style={__styles.eventListView}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
          <View style={{ flex: 1 }}>
            <MyText type='medium' >{item?.title}</MyText>
          </View>
          <View style={{ marginRight: -10, marginTop: -5 }}>
            <MenuButton
              onPress={() => setOptions({ isVisible: true, item })}
            />
          </View>
        </View>
        <View>
          <StatView title={"Groups"} view={() => eventView(item?.group)} />
          <StatView title={"Event Type"} value={item?.recurring_type} />
          <StatView title={"Start Date"} value={convertTimezone2(item?.start_date, timezone).format(dateTimeFormat.date)} />
          <StatView title={"End Date"} value={convertTimezone2(item?.end_date, timezone).format(dateTimeFormat.date)} />
          <StatView title={"Members"} value={item?.member.length} />
          <StatView title={"Status"} view={() => statusView(item?.status, item?._id)} />
        </View>
      </View>
    )
  }

  const titleView = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
        <TitleView
          hideBackBottomButton
          title={title}
        />
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {!isDelegateEvents &&
          <TouchableOpacity
            onPress={() => setViewType((type) => type == "calendar" ? "list" : "calendar")}
            style={__styles.toggleBtnView}
          >
            {viewType == "calendar" ? icons.list(colors.black, 18) : icons.calendar(colors.black, 18)}
          </TouchableOpacity>}
        </View>
      </View>
    )
  }
  return (
    <RootView hideBackBottomButton titleView={titleView} >
      {viewType == "calendar" ?
        <FlatList
          ListHeaderComponent={headerView()}
          data={type == "week" ? Object.keys(calendarEvents) : calendarEvents[curDate]?.list}
          renderItem={renderItem}
          keyExtractor={(item) => type == "week" ? item : item?._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView label={"No Events Found"} />}
        /> :
        <FlatList
          data={eventList}
          renderItem={renderEventItem}
          // keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView label={"No Events Found"} />}
        />}

      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />

      <ConfirmationModal
        title={"Are you sure you want to delete this event?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />
      <FAB onPress={onAddEventScreen} />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default CalendarScreen


const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },
  // {
  //   title: "View Detail",
  //   key: "detail",
  //   icon: icons.threeLinesMenu
  // },

]


const __styles = StyleSheet.create({
  topView: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between"
  },
  calendarTheme: {
    backgroundColor: colors.secondary,
    calendarBackground: colors.secondary,
    textSectionTitleColor: colors.primary,
    textSectionTitleDisabledColor: colors.primary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.black,
    todayTextColor: colors.primary,
    dayTextColor: colors.white,
    textDisabledColor: colors.placeholder,
    dotColor: colors.blue,
    selectedDotColor: 'blue',
    arrowColor: colors.primary,
    disabledArrowColor: colors.primary,
    monthTextColor: colors.white,
    textDayFontSize: 14,
    // textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
    textDayFontFamily: fonts.regular,
    textDayHeaderFontFamily: fonts.regular,
    textMonthFontFamily: fonts.medium,
  },
  calendarView: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 10,
    overflow: "hidden"
  },
  dayCircle: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  eventView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  eventWeekView: {
    marginLeft: 30,
    flex: 1
  },
  eventWeekRootView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginBottom: 10
  },
  eventColorView: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    // marginTop: 4,
    borderWidth: 0.5,
    borderColor: colors.lightText
  },
  eventTitleAndDetail: {
    flex: 1,
    marginLeft: 15
  },
  timeView: {
    marginTop: 2
  },
  mergeButtons: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  mergeButtonView: {
    height: 30,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  mergeButtonText: {
    textTransform: "capitalize",
    fontSize: 12
  },
  divider: {
    height: 30,
    width: 1,
    backgroundColor: colors.primary,
  },
  headingRow: {
    flexDirection: "row"
  },
  headingText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDayView: {
    alignItems: "center"
  },
  toggleBtnView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  googleBnt: {
    // height: 30,
    flexDirection: "row",
    // flexWrap: "wrap",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 5
  },
  eventListView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    marginTop: 10,
  },
  eventListTitleView: {
    flexDirection: "row"
  },
})