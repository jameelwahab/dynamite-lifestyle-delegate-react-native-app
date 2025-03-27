import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { CALENDAR_EVENT_DETAIL_BY_Id, CALENDAR_EVENT_DETAIL_BY_Id_V2, DELETE_CALENDAR_EVENT, GET_EVENT_DETAIL } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import StatView from '../../../components/StatView'
import { colors } from '../../../utilities/colors'
import { selectTimeZone, } from '../../../redux/reducers/timezoneSlice'
import { convertTimezone2 } from '../../../functions/convertTime'
import { dateTimeFormat } from '../../../utilities/constants'
import TitleView from '../../../components/TitleView'
import { icons } from '../../../utilities/icons'
import EventOptionModal from '../components/EventOptionModal'
import MyWebview from '../../../components/MyWebview'
import routes from '../../../navigation/routes'
import { event } from 'react-native-reanimated'

const CalendarDetail = ({ navigation, route }) => {
  const { eventId, iteration_id, type: eventType } = route?.params;
  const isDelegateEvents = eventType == "consultant_user";
  const ref_eventModal = useRef()
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState(null);
  const [iteration, setIteration] = useState(null);





  useEffect(() => {
    getCalendarEventDetail()
  }, [])

  const getCalendarEventDetail = async () => {
    setLoader(true);
    let res = await CALENDAR_EVENT_DETAIL_BY_Id({ navigation, token, id: eventId });
    setLoader(false);
    if (res.code == 200) {
      setIteration(res?.event?.iteration_list.find(x => x._id == iteration_id))
      setData({
        ...res?.event,
        excluded_members: res?.excluded_members
      })
    }
  }

  const deleteCalendarEvent = async (type) => {
    setLoader(true);
    let res = await DELETE_CALENDAR_EVENT({
      navigation, token, body: {
        event_slug: data?.event_slug, iteration_id: iteration_id, update_type: type
      }
    });
    setLoader(false);
    if (res.code == 200) {
      navigation.navigate(routes?.calendarEventsList, {
        refresh: true
      })
    }
  }

  const forDelete = (type) => {
    deleteCalendarEvent(type)
  }

  const titleView = () => (
    <View style={__styles.headerView}>

      <View style={{ flex: 1 }}>
        <TitleView title={data?.title}
          hideBackBottomButton />
      </View>

      {!!data &&
        <View style={__styles.btnRow}>

          <TouchableOpacity
            onPress={() => navigation.navigate(routes.calendarEventsAddEdit, {
              event: { ...iteration, event_slug: data?.event_slug },
              iteration_id
            })}
            style={__styles.headerBtn}>
            {icons.calendar(colors.black, 18)}
          </TouchableOpacity>
          {!isDelegateEvents &&
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.calendarEventsAddEdit, { event: data, iterationId: undefined })}
              style={__styles.headerBtn}>
              {icons.edit(colors.black, 18)}
            </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => ref_eventModal?.current?.openModal()}
            style={__styles.headerBtn}>
            {icons.trash(colors.black, 18)}
          </TouchableOpacity>


        </View>}
    </View>
  )

  return (
    <RootView titleView={titleView}>
      <MyLoader enable={loader} />
			<ScrollView>
				<View style={{paddingBottom:30}}>
      {!!data &&
        <View style={{ flex: 1 }}>
          <View style={__styles.rootView}>
            <MyText fontSize={16} color={colors.primary} >Event</MyText>
            <StatView title={"From"} value={convertTimezone2(data?.start_date_time, timezone).format(dateTimeFormat.dateTime)} uppercase />
            <StatView title={"To"} value={convertTimezone2(data?.end_date_time, timezone).format(dateTimeFormat.dateTime)} uppercase />
          </View>
          {!!iteration &&
            <View style={__styles.rootView}>
              <MyText fontSize={16} color={colors.primary} >Iteration</MyText>
              <StatView title={"From"} value={convertTimezone2(iteration?.start_date_time, timezone).format(dateTimeFormat.dateTime)} uppercase />
              <StatView title={"To"} value={convertTimezone2(iteration?.end_date_time, timezone).format(dateTimeFormat.dateTime)} uppercase />
            </View>}

          {!!data?.description &&
            <View style={__styles.rootView}>
              <MyText fontSize={16} color={colors.primary} >Decription</MyText>
              <View style={{ marginTop: 10 }}>
                <MyWebview html={data?.description} fullWidth />
              </View>
            </View>}


        </View>}
      <EventOptionModal
        ref={ref_eventModal}
        onAgree={forDelete}
        title={"Delete recurring event?"}
      />

				</View>
			</ScrollView>
    </RootView>
  )
}

export default CalendarDetail

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  headerView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBtn: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.primary,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  }
})
